#!/usr/bin/env bash
# 构建 web 与 admin（可传参仅构建其一）
set -e
cd "$(dirname "$0")/.."
if [ "$1" = "web" ]; then
  npm run build:web
elif [ "$1" = "admin" ]; then
  npm run build:admin
else
  npm run build:web
  npm run build:admin
fi
