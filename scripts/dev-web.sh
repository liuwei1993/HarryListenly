#!/usr/bin/env bash
# 启动 C 端听书应用（默认 http://localhost:3000）
set -e
cd "$(dirname "$0")/.."
npm run dev:web
