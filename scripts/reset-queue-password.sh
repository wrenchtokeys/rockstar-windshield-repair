#!/usr/bin/env bash
#
# Rotate the /queue dashboard password (QUEUE_PASSWORD) in production.
#
# This does a full app-version deploy of the CURRENT COMMIT and sets the new
# password in the SAME `update-environment` call. That combination matters:
# EB skips the predeploy build hook on config-only updates (env var change
# with no new app version), which ships unbuilt source and takes the site
# down. See docs/SESSION_NOTES.md (2026-07-01 incident) for the postmortem.
#
# Usage:
#   scripts/reset-queue-password.sh              # generate a random password
#   scripts/reset-queue-password.sh --prompt      # type your own (hidden input)
#
# Deliberately does NOT accept the password as a bare argument — that would
# leak it into shell history and `ps` output.

set -euo pipefail

APP_NAME="rockstar-windshield-repair"
ENV_NAME="rswr-production"
REGION="us-east-1"
BUCKET="elasticbeanstalk-us-east-1-973196283632"
S3_KEY="rswr/deploy.zip"

REPO_ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree has uncommitted changes. Commit or stash before deploying (this script deploys HEAD)." >&2
  exit 1
fi

NEW_PASSWORD=""
if [[ "${1:-}" == "--prompt" ]]; then
  read -rs -p "New queue password: " NEW_PASSWORD
  echo
  read -rs -p "Confirm: " CONFIRM
  echo
  if [[ "$NEW_PASSWORD" != "$CONFIRM" ]]; then
    echo "Passwords did not match." >&2
    exit 1
  fi
elif [[ -n "${1:-}" ]]; then
  echo "This script does not accept the password as a plain argument (it would leak into shell history)." >&2
  echo "Run with --prompt to type one, or with no arguments to generate one." >&2
  exit 1
else
  NEW_PASSWORD="$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 20)"
  echo "Generated new password (shown once below — save it now)."
fi

if [[ -z "$NEW_PASSWORD" ]]; then
  echo "Empty password, aborting." >&2
  exit 1
fi

VERSION_LABEL="queue-password-$(date +%y%m%d%H%M%S)"
TMPZIP="$(mktemp -t deploy-XXXXXX.zip)"
trap 'rm -f "$TMPZIP"' EXIT

echo "Packaging commit $(git rev-parse --short HEAD) as $VERSION_LABEL..."
git archive --format=zip -o "$TMPZIP" HEAD

echo "Uploading to s3://$BUCKET/$S3_KEY..."
aws s3 cp "$TMPZIP" "s3://$BUCKET/$S3_KEY"

echo "Creating application version $VERSION_LABEL..."
aws elasticbeanstalk create-application-version \
  --application-name "$APP_NAME" \
  --version-label "$VERSION_LABEL" \
  --source-bundle "S3Bucket=$BUCKET,S3Key=$S3_KEY" \
  --region "$REGION" >/dev/null

echo "Deploying $VERSION_LABEL and setting QUEUE_PASSWORD in one call (full app-version deploy)..."
aws elasticbeanstalk update-environment \
  --environment-name "$ENV_NAME" \
  --version-label "$VERSION_LABEL" \
  --option-settings "Namespace=aws:elasticbeanstalk:application:environment,OptionName=QUEUE_PASSWORD,Value=$NEW_PASSWORD" \
  --region "$REGION" >/dev/null

echo "Waiting for environment to stabilize..."
STATUS=""
HEALTH=""
for i in $(seq 1 30); do
  STATUS=$(aws elasticbeanstalk describe-environments \
    --environment-names "$ENV_NAME" --region "$REGION" \
    --query "Environments[0].Status" --output text)
  HEALTH=$(aws elasticbeanstalk describe-environments \
    --environment-names "$ENV_NAME" --region "$REGION" \
    --query "Environments[0].Health" --output text)
  echo "  [$i/30] Status=$STATUS Health=$HEALTH"
  if [[ "$STATUS" == "Ready" ]]; then
    break
  fi
  sleep 10
done

if [[ "$STATUS" != "Ready" || "$HEALTH" != "Green" ]]; then
  echo "Environment did not reach Ready/Green. Check the EB console before trusting the new password:" >&2
  echo "  https://console.aws.amazon.com/elasticbeanstalk/home?region=$REGION#/environment/dashboard?applicationName=$APP_NAME&environmentId=$ENV_NAME" >&2
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://rockstarwindshield.repair/")
echo "Site check: HTTP $HTTP_CODE"
if [[ "$HTTP_CODE" != "200" ]]; then
  echo "Site did not return 200 after deploy — investigate before relying on this being live." >&2
  exit 1
fi

echo
echo "Done. Environment is Ready/Green and the site is up."
echo "New /queue password: $NEW_PASSWORD"
echo "Save it in your password manager now — it is not displayed or stored anywhere else."
