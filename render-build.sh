#!/usr/bin/env bash
set -o errexit

# 1) Install deps
npm install

# 2) Ensure cache dirs exist
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
PROJECT_CACHE_DIR=/opt/render/project/src/.cache/puppeteer
mkdir -p "$PUPPETEER_CACHE_DIR"
mkdir -p "$PROJECT_CACHE_DIR/chrome"

# 3) Install Puppeteer Chrome
npx puppeteer browsers install chrome

# 4) If we have a cached copy from a previous build, restore it
if [[ -d "$PROJECT_CACHE_DIR/chrome" && ! -z "$(ls -A "$PROJECT_CACHE_DIR/chrome")" ]]; then
  echo "Restoring Puppeteer cache from project cache"
  cp -R "$PROJECT_CACHE_DIR/chrome/"* "$PUPPETEER_CACHE_DIR/"
else
  # otherwise store this freshly downloaded Chrome into project cache
  echo "Storing Puppeteer cache into project cache"
  cp -R "$PUPPETEER_CACHE_DIR/"* "$PROJECT_CACHE_DIR/chrome/"
fi
