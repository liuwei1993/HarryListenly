#!/usr/bin/env bash
# 在服务器上重置 MySQL root 密码为 meetlove20260128
# 用法一：在服务器上直接执行（需 root 或 sudo）:
#   sudo bash mysql-reset-root-password.sh
# 用法二：从本机通过 SSH 在服务器执行（先同步脚本再执行）:
#   scp scripts/mysql-reset-root-password.sh root@harry.help:/tmp/ && ssh root@harry.help 'bash /tmp/mysql-reset-root-password.sh'
#
# 采用 skip-grant-tables 方式：临时写入配置、重启、改密码、恢复配置、再重启。
set -e

SUDO=""
[ "$(id -u)" != "0" ] && SUDO=sudo

NEW_PASSWORD="${MYSQL_ROOT_NEW_PASSWORD:-meetlove20260128}"

# 检测 systemd 下 MySQL 服务名
if systemctl is-active mysql &>/dev/null; then
  SVC=mysql
elif systemctl is-active mysqld &>/dev/null; then
  SVC=mysqld
else
  echo "未检测到运行中的 MySQL 服务 (mysql/mysqld)。请确认 MySQL 已安装且由 systemd 管理。"
  exit 1
fi

# 配置片段：用于临时启用 skip-grant-tables
# 支持 Ubuntu/Debian (/etc/mysql/...) 与 CentOS/RHEL (/etc/my.cnf.d)
CONF_DIR=""
if [ -n "$MYSQL_CONF_DIR" ] && [ -d "$MYSQL_CONF_DIR" ]; then
  CONF_DIR="$MYSQL_CONF_DIR"
elif [ -d "/etc/mysql/mysql.conf.d" ]; then
  CONF_DIR="/etc/mysql/mysql.conf.d"
elif [ -d "/etc/mysql/conf.d" ]; then
  CONF_DIR="/etc/mysql/conf.d"
elif [ -d "/etc/my.cnf.d" ]; then
  CONF_DIR="/etc/my.cnf.d"
fi
CONF_RESET="${CONF_DIR}/99-reset-pwd.cnf"
if [ -z "$CONF_DIR" ] || [ ! -d "$CONF_DIR" ]; then
  echo "未找到 MySQL 配置目录。可设置 MYSQL_CONF_DIR 指定，例如:"
  echo "  export MYSQL_CONF_DIR=/etc/my.cnf.d"
  echo "  sudo bash $0"
  exit 1
fi

echo "使用服务: $SVC"
echo "临时配置: $CONF_RESET"
echo "新密码: $NEW_PASSWORD"
echo "---"

# 1. 写入临时配置
echo "[mysqld]" | $SUDO tee "$CONF_RESET" >/dev/null
echo "skip-grant-tables" | $SUDO tee -a "$CONF_RESET" >/dev/null

# 2. 重启 MySQL
echo "重启 MySQL (skip-grant-tables)..."
$SUDO systemctl restart "$SVC"
sleep 2
if ! systemctl is-active --quiet "$SVC"; then
  echo "错误: MySQL 启动失败，请检查日志: journalctl -u $SVC -n 50"
  $SUDO rm -f "$CONF_RESET"
  $SUDO systemctl restart "$SVC"
  exit 1
fi

# 3. 改密码（先 FLUSH PRIVILEGES 再 ALTER USER）
echo "修改 root 密码..."
$SUDO mysql -u root -e "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY '$NEW_PASSWORD';" || {
  echo "修改失败，尝试仅 FLUSH 后 ALTER..."
  $SUDO mysql -u root -e "FLUSH PRIVILEGES;"
  $SUDO mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$NEW_PASSWORD';"
}

# 4. 删除临时配置并再次重启
echo "恢复配置并重启 MySQL..."
$SUDO rm -f "$CONF_RESET"
$SUDO systemctl restart "$SVC"

echo "完成。root@localhost 密码已设为: $NEW_PASSWORD"
echo "验证: mysql -u root -p -e 'SELECT 1'"
