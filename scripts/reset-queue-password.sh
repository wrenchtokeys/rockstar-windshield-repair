#!/usr/bin/env bash
#
# Rotate the /queue dashboard password (QUEUE_PASSWORD) in production.
#
# Amplify serves env vars to the build, and next.config.ts inlines the
# server-only ones into the server bundle (see docs/DEPLOYMENT.md). So
# changing the value is NOT enough on its own — the app must be rebuilt
# before the new password takes effect. This script does both and waits.
#
# Rewritten 2026-07-25 for Amplify. The previous version drove Elastic
# Beanstalk, which was terminated in the 2026-07-11 migration; it had been
# silently broken since, along with the recovery command in the README.
#
# Usage:
#   scripts/reset-queue-password.sh              # generate a random password
#   scripts/reset-queue-password.sh --prompt     # type your own (hidden input)
#
# Deliberately does NOT accept the password as a bare argument — that would
# leak it into shell history and `ps` output.
#
# To just LOOK UP the current password without changing it, see
# scripts/get-queue-password.sh.

set -euo pipefail

APP_ID="d12me65ddm59c9"
BRANCH="main"
REGION="us-east-1"

command -v jq >/dev/null || { echo "jq is required (brew install jq)." >&2; exit 1; }

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
  echo "Generated a new password (shown once at the end — save it to your password manager)."
fi

if [[ -z "$NEW_PASSWORD" ]]; then
  echo "Empty password, aborting." >&2
  exit 1
fi

# `update-app --environment-variables` REPLACES the whole map, so the new
# value has to be merged into the existing one. Setting it bare would wipe
# DYNAMODB_TABLE, the Places API key, and everything else — a silent
# production outage. Merge with jq, never hand-write the map.
echo "Reading current environment variables..."
CURRENT="$(aws amplify get-app --app-id "$APP_ID" --region "$REGION" \
  --query 'app.environmentVariables' --output json)"

COUNT_BEFORE="$(jq 'length' <<<"$CURRENT")"
if [[ "$COUNT_BEFORE" -lt 2 ]]; then
  echo "Only $COUNT_BEFORE env var(s) found — that looks wrong, aborting rather than risk wiping config." >&2
  exit 1
fi

MERGED="$(jq --arg pw "$NEW_PASSWORD" '. + {QUEUE_PASSWORD: $pw}' <<<"$CURRENT")"
COUNT_AFTER="$(jq 'length' <<<"$MERGED")"
if [[ "$COUNT_AFTER" -lt "$COUNT_BEFORE" ]]; then
  echo "Merge would drop variables ($COUNT_BEFORE -> $COUNT_AFTER), aborting." >&2
  exit 1
fi

echo "Updating QUEUE_PASSWORD (preserving the other $((COUNT_AFTER - 1)) variables)..."
aws amplify update-app --app-id "$APP_ID" --region "$REGION" \
  --environment-variables "$MERGED" >/dev/null

# The value is only baked in at build time, so a rebuild is mandatory.
echo "Starting a rebuild so the new password reaches the runtime..."
JOB_ID="$(aws amplify start-job --app-id "$APP_ID" --branch-name "$BRANCH" \
  --job-type RELEASE --region "$REGION" --query 'jobSummary.jobId' --output text)"
echo "  job $JOB_ID"

STATUS=""
for i in $(seq 1 40); do
  STATUS="$(aws amplify get-job --app-id "$APP_ID" --branch-name "$BRANCH" \
    --job-id "$JOB_ID" --region "$REGION" --query 'job.summary.status' --output text)"
  echo "  [$i/40] $STATUS"
  case "$STATUS" in
    SUCCEED) break ;;
    FAILED|CANCELLED)
      echo "Deploy $STATUS — the password was changed but the running site may still use the old one." >&2
      echo "Check the Amplify console, then re-run this script or start a job manually." >&2
      exit 1
      ;;
  esac
  sleep 15
done

if [[ "$STATUS" != "SUCCEED" ]]; then
  echo "Timed out waiting for the deploy. Check the Amplify console for job $JOB_ID." >&2
  exit 1
fi

CODE="$(curl -s -o /dev/null -w '%{http_code}' https://rockstarwindshield.repair/queue)"
echo "Site check: /queue returned HTTP $CODE"

echo
echo "==================================================================="
echo "  New /queue password:  $NEW_PASSWORD"
echo "==================================================================="
echo "Save it in your password manager NOW — it is not stored anywhere in"
echo "this repo, and this is the only time the script prints it."
echo "You can always read it back with: scripts/get-queue-password.sh"
