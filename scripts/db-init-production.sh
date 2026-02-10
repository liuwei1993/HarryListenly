#!/usr/bin/env bash
# 在生产环境（harry.help）初始化数据库表
# 通过 SSH 在服务器执行 Prisma db push；会先同步本地 .env，再创建表
# 前置：服务器上已有项目目录（建议先执行一次 deploy.sh）；MySQL 上需已存在库（如 harrylistenly）
set -e

REMOTE_USER="${DEPLOY_USER:-root}"
REMOTE_HOST="${DEPLOY_HOST:-harry.help}"
REMOTE_DIR="${DEPLOY_DIR:-/var/www/harrylistenly}"
SSH_PORT="${DEPLOY_SSH_PORT:-22}"
SSH_OPTS=(-o "StrictHostKeyChecking=accept-new")

if [ -n "$DEPLOY_SSH_KEY" ]; then
  SSH_OPTS+=(-i "$DEPLOY_SSH_KEY")
fi

REMOTE="${REMOTE_USER}@${REMOTE_HOST}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "目标: ${REMOTE}"
echo "远程目录: ${REMOTE_DIR}"
echo "---"

# 检查远程目录是否存在
if ! ssh "${SSH_OPTS[@]}" -p "$SSH_PORT" "$REMOTE" "test -d \"$REMOTE_DIR\""; then
  echo "错误: 远程目录 $REMOTE_DIR 不存在。"
  echo "请先执行 ./scripts/deploy.sh 完成首次部署，或设置 DEPLOY_DIR 为实际项目路径。"
  exit 1
fi

# 同步 .env，使服务器 DATABASE_URL 与本地一致
if [ -f "$ROOT/apps/web/.env" ]; then
  echo "同步 .env 到服务器..."
  rsync -avz -e "ssh ${SSH_OPTS[*]} -p ${SSH_PORT}" \
    "$ROOT/apps/web/.env" "${REMOTE}:${REMOTE_DIR}/apps/web/.env"
  ssh "${SSH_OPTS[@]}" -p "$SSH_PORT" "$REMOTE" "cp ${REMOTE_DIR}/apps/web/.env ${REMOTE_DIR}/apps/admin/.env" 2>/dev/null || true
fi

echo "在服务器上执行 Prisma db push 创建表..."
ssh "${SSH_OPTS[@]}" -p "$SSH_PORT" "$REMOTE" "bash -s" -- "$REMOTE_DIR" << 'REMOTE_SCRIPT'
set -e
REMOTE_DIR="$1"
cd "$REMOTE_DIR"
export PATH="$PATH:/usr/local/bin:$HOME/.nvm/versions/node/*/bin"

(cd apps/web && npx prisma generate)
(cd apps/web && npx prisma db push)

echo "生产环境数据库表已就绪。"
REMOTE_SCRIPT
