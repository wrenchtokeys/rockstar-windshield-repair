#!/usr/bin/env bash
#
# Print the current /queue dashboard password.
#
# Read-only: it changes nothing and cannot break the site. The password is
# stored ONLY in the Amplify app's environment variables — deliberately not
# in this repo, which is a PUBLIC GitHub repository. This script is the
# supported way to get it back when you forget it.
#
# Usage:
#   scripts/get-queue-password.sh            # print it
#   scripts/get-queue-password.sh --copy     # copy to clipboard, don't print
#
# Prefer --copy on a shared screen: the plain form leaves the password in
# your terminal scrollback.

set -euo pipefail

APP_ID="d12me65ddm59c9"
REGION="us-east-1"

PW="$(aws amplify get-app --app-id "$APP_ID" --region "$REGION" \
  --query 'app.environmentVariables.QUEUE_PASSWORD' --output text)"

if [[ -z "$PW" || "$PW" == "None" ]]; then
  echo "QUEUE_PASSWORD is not set on Amplify app $APP_ID." >&2
  echo "Set one with: scripts/reset-queue-password.sh" >&2
  exit 1
fi

if [[ "${1:-}" == "--copy" ]]; then
  if command -v pbcopy >/dev/null; then
    printf '%s' "$PW" | pbcopy
    echo "Queue password copied to clipboard."
  else
    echo "pbcopy not available on this platform." >&2
    exit 1
  fi
else
  echo "$PW"
fi
