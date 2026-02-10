# 运行脚本说明

在仓库根目录执行，或先 `cd` 到仓库根目录。

| 脚本 | 说明 |
|------|------|
| `./scripts/install.sh` | 安装全部依赖（npm install） |
| `./scripts/dev-web.sh` | 启动听书应用 http://localhost:3000 |
| `./scripts/dev-admin.sh` | 启动管理后台 http://localhost:3001 |
| `./scripts/dev-all.sh` | 同时启动 web 与 admin |
| `./scripts/build.sh` | 构建（无参=两个都构建；可传 `web` 或 `admin`） |
| `./scripts/db-push.sh` | Prisma db push（可传 `web` 或 `admin`） |
| `./scripts/db-init-production.sh` | 在生产环境（harry.help）初始化数据库表 |
| `./scripts/db-seed.sh` | 执行 web 种子数据（若有） |
| `./scripts/deploy.sh` | 远程部署到 root@harry.help（Web 8001，Admin 8002） |

首次使用可执行：`chmod +x scripts/*.sh`

### 生产环境数据库初始化（db-init-production.sh）

- 在 harry.help 服务器上执行 `prisma db push` 创建表
- **前置**：服务器 `apps/web/.env` 已配置生产环境 `DATABASE_URL`，且数据库 `harrylistenly` 已存在
- 云 RDS：需先在控制台创建空库 `harrylistenly`，再执行本脚本
- 环境变量（可选）：`DEPLOY_HOST`、`DEPLOY_DIR`、`DEPLOY_SSH_PORT`、`DEPLOY_SSH_KEY`

### 远程部署（deploy.sh）

- 目标：`root@harry.help`，远程目录默认 `/var/www/harrylistenly`
- 端口：听书应用 **8001**，管理后台 **8002**
- 依赖：服务器需安装 Node、PM2（`npm i -g pm2`）
- **DATABASE_URL**：部署时会自动将本地 `apps/web/.env` 同步到服务器 `apps/web` 与 `apps/admin`，使服务器与本地一致；若本地无该文件则需在服务器上手动创建
- 环境变量（可选）：`DEPLOY_HOST`、`DEPLOY_DIR`、`DEPLOY_SSH_PORT`、`DEPLOY_SSH_KEY`
