#!/bin/bash
# Exit on any error
set -e

echo "Starting Application Setup on Ubuntu 24.04 LTS..."

# **Step 1: Update System Packages**
echo "Updating package lists..."
sudo apt update -y

echo "Upgrading installed packages..."
sudo apt upgrade -y

# Step 2: Fixing broken packages if needed
echo "Fixing broken dependencies..."
sudo apt --fix-broken install -y

# Step 3: Removing any existing MySQL installation to prevent conflicts
echo "Removing previous MySQL installation (if any)..."
sudo apt remove --purge mysql-server mysql-client mysql-common mysql-server-core-* mysql-client-core-* -y || true
sudo rm -rf /etc/mysql /var/lib/mysql /var/log/mysql
sudo apt autoremove -y
sudo apt autoclean -y

# **Step 4: Install MySQL Server**
echo "Installing MySQL Server..."
sudo apt install -y mysql-server

# **Step 5: Configure MySQL Root Password Securely**

echo "Setting up MySQL root password non-interactively..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Wait for MySQL to initialize
sleep 5

# Run MySQL commands as root to configure authentication and password
echo "Configuring MySQL authentication and root password..."

# **Step 6: Secure MySQL Installation**
echo "Securing MySQL installation..."
ROOT_PASSWORD="PriyeshModi123"
sudo mysql --user=root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${ROOT_PASSWORD}';
DELETE FROM mysql.user WHERE User='';
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test_%';
FLUSH PRIVILEGES;
EOF

# **Step 7: Create Database & User**
DB_NAME="healthcheck"
DB_USER="priyeshmodi"
DB_PASS="PriyeshSecurePass"

echo "Creating MySQL Database and User..."
sudo mysql --user=root --password="${ROOT_PASSWORD}" <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

# **Step 8: Create Linux Group & User**
APP_GROUP="webapp_group"
APP_USER="webapp_user"
APP_ZIP="/app.zip"

echo "Creating Linux group '${APP_GROUP}' and user '${APP_USER}'..."
sudo groupadd -f ${APP_GROUP}
sudo id -u ${APP_USER} &>/dev/null || sudo useradd -m -g ${APP_GROUP} -s /bin/bash ${APP_USER}

# **Step 9: Unzip Application in /opt/csye6225**
APP_DIR="/opt/csye6225"

echo "Setting up application directory in '${APP_DIR}'..."
sudo mkdir -p ${APP_DIR}

sudo apt install unzip

# Assuming application zip is available in the current directory
if [ -f "$APP_ZIP" ]; then
    echo "Unzipping application files into '${APP_DIR}'..."
    sudo unzip -o ${APP_ZIP} -d ${APP_DIR}
    sudo chown -R ${APP_USER}:${APP_GROUP} ${APP_DIR}
else
    echo "⚠️ Application ZIP file '${APP_ZIP}' not found! Skipping unzip step."
fi

# **Step 10: Configure Permissions**
echo "Setting up permissions..."

sudo chown ${APP_USER}:${APP_GROUP} ${APP_DIR}
sudo chmod -R 755 ${APP_DIR}

echo "Setup Completed Successfully!"
