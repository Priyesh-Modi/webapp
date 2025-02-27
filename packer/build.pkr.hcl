build {
  sources = ["source.amazon-ebs.ubuntu", "source.googlecompute.gcp-image"]

  provisioner "shell" {
    inline = [
      "mkdir -p /tmp/app" # Create the directory before copying
    ]
  }

  # Copy the src directory separately
  provisioner "file" {
    source      = "./src"
    destination = "/tmp/app/src"
  }

  # Copy package.json
  provisioner "file" {
    source      = "./package.json"
    destination = "/tmp/app/package.json"
  }

  # Copy .env file
  # provisioner "file" {
  #   source      = "./.env"
  #   destination = "/tmp/app/.env"
  # }

  # Copy csye6225.service separately
  provisioner "file" {
    source      = "./csye6225.service"
    destination = "/tmp/app/csye6225.service"
  }

  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y mysql-server nodejs npm",
      "sudo systemctl enable mysql",
      "sudo systemctl start mysql",
      "sudo mysql -e \"ALTER USER '${var.DB_USER}'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY '${var.DB_PASSWORD}'; CREATE DATABASE ${var.DB_NAME}; GRANT ALL PRIVILEGES ON ${var.DB_NAME}.* TO '${var.DB_USER}'@'localhost'; FLUSH PRIVILEGES;\"",
      "sudo useradd -r -s /usr/sbin/nologin csye6225 || true",
      "getent group csye6225 || sudo groupadd csye6225",
      "sudo usermod -a -G csye6225 csye6225",
      "sudo mkdir -p /opt/csye6225/app",

      # Copy everything from /tmp/app to /opt/csye6225/app
      "sudo cp -r /tmp/app/. /opt/csye6225/app",

      # Debugging: Check copied files
      "ls -l /opt/csye6225/app",

      # Set correct ownership
      "sudo chown -R csye6225:csye6225 /opt/csye6225/app",

      # Creating .env file
      "sudo bash -c 'echo \"DB_NAME=${var.DB_NAME}\" > /opt/csye6225/app/.env'",
      "sudo bash -c 'echo \"DB_USER=${var.DB_USER}\" >> /opt/csye6225/app/.env'",
      "sudo bash -c 'echo \"DB_PASSWORD=${var.DB_PASSWORD}\" >> /opt/csye6225/app/.env'",
      "sudo bash -c 'echo \"DB_HOST=localhost\" >> /opt/csye6225/app/.env'",
      "sudo bash -c 'echo \"DB_PORT=3306\" >> /opt/csye6225/app/.env'",
      "sudo bash -c 'echo \"PORT=${var.app_port}\" >> /opt/csye6225/app/.env'",
      # "sudo bash -c 'echo \"DB_DIALECT=mysql\" >> /opt/csye6225/app/.env'",
      "sudo bash -c 'echo \"NODE_ENV=production\" >> /opt/csye6225/app/.env'",

      # Install dependencies
      "cd /opt/csye6225/app",
      "ls -l package.json || echo 'Error: package.json not found!'", # Debugging
      "sudo npm install",

      # Ensure service setup
      "sudo cp /opt/csye6225/app/csye6225.service /etc/systemd/system/csye6225.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable csye6225.service"
    ]
  }
}
