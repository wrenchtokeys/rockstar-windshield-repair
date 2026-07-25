#!/usr/bin/env bash
#
# Install this repo's git hooks. Git hooks live in .git/hooks, which is not
# itself version-controlled, so this has to be run once per clone.
#
#   scripts/install-hooks.sh

set -euo pipefail

REPO_ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)"
HOOK_DIR="$REPO_ROOT/.git/hooks"
mkdir -p "$HOOK_DIR"

cat > "$HOOK_DIR/pre-commit" <<'HOOK'
#!/usr/bin/env bash
# Installed by scripts/install-hooks.sh — edit the source, not this copy.
exec "$(git rev-parse --show-toplevel)/scripts/pre-commit-secret-guard.sh"
HOOK

chmod +x "$HOOK_DIR/pre-commit"
echo "Installed pre-commit secret guard -> $HOOK_DIR/pre-commit"
echo "Test it with:  scripts/pre-commit-secret-guard.sh"
