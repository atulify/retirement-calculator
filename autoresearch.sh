#!/bin/bash
set -euo pipefail

rm -rf dist
npm run build

if [ ! -d dist ]; then
  echo "dist/ not found" >&2
  exit 1
fi

sum_bytes() {
  local pattern="$1"
  local bytes
  bytes=$(find dist -type f $pattern -print0 | xargs -0 stat -f%z | awk '{s+=$1} END {print s+0}')
  echo "$bytes"
}

total_bytes=$(sum_bytes "")
js_bytes=$(sum_bytes "-name '*.js'")
css_bytes=$(sum_bytes "-name '*.css'")

total_kb=$(( (total_bytes + 1023) / 1024 ))
js_kb=$(( (js_bytes + 1023) / 1024 ))
css_kb=$(( (css_bytes + 1023) / 1024 ))

echo "METRIC bundle_kb=${total_kb}"
echo "METRIC js_kb=${js_kb}"
echo "METRIC css_kb=${css_kb}"
