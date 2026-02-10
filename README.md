# HarryListenly

听书应用（C 端）与管理后台（Admin）分离存放的 monorepo。

## 目录结构

```
HarryListenly/
├── apps/
│   ├── web/          # C 端听书应用（Next.js，端口 3000）
│   └── admin/        # 管理后台（Next.js，端口 3001）
├── docs/             # 产品文档、技术架构、Admin PRD
├── package.json      # 根 workspace 配置
└── README.md
```

- **apps/web**：用户端听书（首页、分类、专辑、播放器、我的等）。
- **apps/admin**：运营/编辑端（登录、分类/专辑/节目 CRUD、上传封面与音频）。
- **docs**：产品文档、技术架构文档、Admin 产品文档。

## 开发

在仓库根目录安装依赖并启动：

```bash
npm install
npm run dev:web    # 启动听书应用 http://localhost:3000
npm run dev:admin  # 启动管理后台 http://localhost:3001
```

或进入子项目分别启动：

```bash
cd apps/web && npm install && npm run dev
cd apps/admin && npm install && npm run dev -p 3001
```

## 数据库

两应用可共用同一 MySQL（或开发阶段 SQLite）。在各自目录下配置 `prisma/schema.prisma` 与 `.env` 中的 `DATABASE_URL`。
