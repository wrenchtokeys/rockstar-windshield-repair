#!/usr/bin/env bash
#
# Pre-commit guard: refuse to commit secrets into this PUBLIC repository.
#
# Install (once, per clone — git hooks are not themselves committed):
#   scripts/install-hooks.sh
#
# It checks two things against the STAGED diff:
#   1. Filenames that should never be tracked (.env*, *.pem, key files).
#   2. Added lines that assign a value to a known secret-ish variable —
#      QUEUE_PASSWORD, API keys, AWS secret keys.
#
# The live QUEUE_PASSWORD value is deliberately NOT baked into this script:
# that would just move the secret into a different file on disk. This matches
# on the variable name and shape instead.
#
# Bypass (only when you are certain it is a false positive):
#   git commit --no-verify

set -uo pipefail

fail=0

# --- 1. Filenames that must never be tracked ---------------------------------
staged_names="$(git diff --cached --name-only --diff-filter=AM)"
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  case "$f" in
    .env|.env.*|*/.env|*/.env.*|*.pem|*.p12|*.pfx|id_rsa|*/id_rsa|*.key)
      echo "BLOCKED: '$f' looks like a secrets/key file and must not be committed." >&2
      fail=1
      ;;
  esac
done <<<"$staged_names"

# --- 2. Secret-looking assignments in added lines ----------------------------
# Only added lines (leading '+'), excluding the diff header ('+++').
added="$(git diff --cached --unified=0 | grep -E '^\+' | grep -Ev '^\+\+\+' || true)"

# A quoted-or-bare value of >=8 chars assigned to a sensitive name.
pattern='(QUEUE_PASSWORD|AWS_SECRET_ACCESS_KEY|GOOGLE_PLACES_API_KEY|SENDGRID_API_KEY|[A-Z_]*(SECRET|PASSWORD|APIKEY|API_KEY|TOKEN))[[:space:]]*[:=][[:space:]]*["'"'"']?[A-Za-z0-9/+_.-]{8,}'

# Ignore the safe forms: reads from process.env, shell indirection, the
# documented lookup commands, and placeholder text.
offenders="$(grep -EI "$pattern" <<<"$added" \
  | grep -Ev 'process\.env|\$\{?[A-Za-z_]|<<<|--query|NEW_PASSWORD_HERE|your-|example|placeholder|xxx|\*\*\*' \
  || true)"

if [[ -n "$offenders" ]]; then
  echo "BLOCKED: staged changes look like they contain a hardcoded secret:" >&2
  # Print the variable name only, never the value.
  sed -E 's/([:=]).*/\1 <redacted>/' <<<"$offenders" | sed 's/^/    /' >&2
  fail=1
fi

if [[ "$fail" -ne 0 ]]; then
  cat >&2 <<'MSG'

This repository is PUBLIC. Secrets belong in Amplify environment variables,
not in git — see the "The password is never written down in this repo" note
in README.md. To read the queue password back:

    scripts/get-queue-password.sh

If this is genuinely a false positive: git commit --no-verify
MSG
  exit 1
fi

exit 0
