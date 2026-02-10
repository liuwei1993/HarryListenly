#!/usr/bin/env bash
# 在服务器上执行，用于排查外网无法访问 8001/8002 的原因
# 用法：复制到服务器后执行 bash server-check-ports.sh
# 或：ssh root@harry.help 'bash -s' < scripts/server-check-ports.sh
set -e

echo "=== 1. 检查 8001/8002 监听地址 ==="
echo "若只显示 127.0.0.1 则仅本机可访问；若显示 0.0.0.0 则已监听所有网卡"
ss -tlnp | grep -E ':8001|:8002' || true
echo ""

echo "=== 2. 检查 firewalld 状态与已开放端口 ==="
if command -v firewall-cmd &>/dev/null; then
  systemctl is-active firewalld 2>/dev/null && echo "firewalld: 运行中" || echo "firewalld: 未运行"
  echo "当前 public 区已开放端口:"
  firewall-cmd --zone=public --list-ports 2>/dev/null || true
  echo ""
  if ! firewall-cmd --zone=public --list-ports 2>/dev/null | grep -q 8001; then
    echo ">>> 8001 未在防火墙放行，在服务器上执行以下命令放行并重载："
    echo "    sudo firewall-cmd --zone=public --permanent --add-port=8001/tcp"
    echo "    sudo firewall-cmd --zone=public --permanent --add-port=8002/tcp"
    echo "    sudo firewall-cmd --reload"
  fi
else
  echo "未安装 firewalld，请检查 iptables 或云厂商安全组是否放行 8001、8002"
fi
echo ""

echo "=== 3. 若使用云服务器（阿里云/腾讯云/AWS 等）==="
echo "请在控制台「安全组」中添加入站规则：允许 TCP 8001、8002 端口（来源 0.0.0.0/0 或按需限制）。"
echo ""
echo "=== 4. 本机快速测试 ==="
echo "在服务器上执行: curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8001"
curl -s -o /dev/null -w "127.0.0.1:8001 返回 HTTP %{http_code}\n" http://127.0.0.1:8001 2>/dev/null || echo "127.0.0.1:8001 连接失败"
