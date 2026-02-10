#!/usr/bin/env bash
# 远程部署：同步代码到 root@harry.help，在服务器上安装依赖、构建并用 PM2 启动
# 听书应用端口 8001，Admin 端口 8002
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
echo "Web 端口: 8001, Admin 端口: 8002"
echo "---"

# 1. 同步代码（排除 node_modules、.next、.git 等）
echo "同步代码..."
rsync -avz --delete \
  -e "ssh ${SSH_OPTS[*]} -p ${SSH_PORT}" \
  --exclude "node_modules" \
  --exclude ".next" \
  --exclude ".git" \
  --exclude "*.log" \
  --exclude ".env" \
  "$ROOT/" "${REMOTE}:${REMOTE_DIR}/"

# 不同步本地 .env，服务端使用服务器上已有 .env（DATABASE_URL 密码等需在服务器单独配置）

# 2. 在服务器上安装依赖、构建、重启 PM2
echo "在服务器上安装依赖、构建并重启..."
ssh "${SSH_OPTS[@]}" -p "$SSH_PORT" "$REMOTE" "bash -s" -- "$REMOTE_DIR" << 'REMOTE_SCRIPT'
set -e
REMOTE_DIR="$1"
cd "$REMOTE_DIR"

# 若未安装 PM2，可先安装：npm i -g pm2
export PATH="$PATH:/usr/local/bin:$HOME/.nvm/versions/node/*/bin"

npm install

echo "生成 Prisma Client..."
(cd apps/web && npx prisma generate)

echo "构建 web..."
(cd apps/web && npm run build)

echo "构建 admin..."
(cd apps/admin && npm run build)

# 使用 PM2 启动/重启（需服务器已安装 pm2: npm i -g pm2）
if command -v pm2 >/dev/null 2>&1; then
  pm2 start ecosystem.config.js || pm2 reload ecosystem.config.js
  pm2 save
  echo "PM2 已启动/已重载。"
else
  echo "未检测到 pm2，请先安装: npm i -g pm2"
  echo "或手动启动: cd apps/web && PORT=8001 npm run start &  cd apps/admin && PORT=8002 npm run start &"
fi
REMOTE_SCRIPT

echo "部署完成。"
echo "听书应用: http://${REMOTE_HOST}:8001"
echo "管理后台: http://${REMOTE_HOST}:8002"
