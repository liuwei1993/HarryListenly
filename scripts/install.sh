#!/usr/bin/env bash
# 在仓库根目录安装所有依赖（workspaces）
set -e
cd "$(dirname "$0")/.."
npm install
