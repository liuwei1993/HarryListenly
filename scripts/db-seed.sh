#!/usr/bin/env bash
# 执行种子数据（仅 web 应用有 seed 时使用）
set -e
cd "$(dirname "$0")/.."
npm run db:seed --workspace=apps/web 2>/dev/null || echo "apps/web 未配置 db:seed，跳过"
