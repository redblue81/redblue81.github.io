#!/usr/bin/env bash
set -euo pipefail

if ! bundle check >/dev/null 2>&1; then
  echo "Installazione gemme (prima esecuzione, può richiedere qualche minuto)..."
  bundle install --quiet
fi

bundle exec jekyll build
ruby -rjson -e 'JSON.parse(File.read("_site/search.json")); puts "search.json OK"'
bundle exec htmlproofer ./_site \
  --disable-external \
  --assume-extension \
  --ignore-empty-alt \
  --ignore-missing-alt \
  --no-enforce-https \
  --ignore-urls "/assets/images/xc3028-v27.fw,/assets/images/k10temp.tar.gz,/assets/images/em28xx-new.tar.gz"
