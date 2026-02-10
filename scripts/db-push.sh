#!/usr/bin/env bash
# 执行 Prisma db push（可传参 web 或 admin，默认只执行 web）
# 使用前请在仓库根目录执行：npm install
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [ "$1" = "web" ]; then
  (cd apps/web && npx prisma db push)
elif [ "$1" = "admin" ]; then
  (cd apps/admin && npx prisma db push)
else
  (cd apps/web && npx prisma db push)
fi
