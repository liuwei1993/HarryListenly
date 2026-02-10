#!/usr/bin/env bash
# 同时启动 web 与 admin（前后台各一个进程）
set -e
cd "$(dirname "$0")/.."
echo "启动 web (3000) 与 admin (3001)..."
npm run dev:web &
npm run dev:admin &
wait
