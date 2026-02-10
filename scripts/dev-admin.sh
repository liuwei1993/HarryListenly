#!/usr/bin/env bash
# 启动管理后台（默认 http://localhost:3001）
set -e
cd "$(dirname "$0")/.."
npm run dev:admin
