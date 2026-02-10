/**
 * PM2 进程配置（远程服务器使用）
 * 听书应用端口 8001，Admin 端口 8002
 * 用 node 直接跑 next 可执行文件，不依赖 npm/npx PATH。
 */
module.exports = {
  apps: [
    {
      name: "harrylistenly-web",
      cwd: "apps/web",
      script: "node",
      args: ["../../node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", "8001"],
      instances: 1,
      autorestart: true,
    },
    {
      name: "harrylistenly-admin",
      cwd: "apps/admin",
      script: "node",
      args: ["../../node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", "8002"],
      instances: 1,
      autorestart: true,
    },
  ],
};
