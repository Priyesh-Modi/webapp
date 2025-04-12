build {
  sources = ["source.amazon-ebs.ubuntu"]
  # sources = ["source.googlecompute.gcp-image"]

  provisioner "shell" {
    inline = [
      "mkdir -p /tmp/app" # Create the directory before copying
    ]
  }

  # Copy the src directory separately
  provisioner "file" {
    source      = "src"
    destination = "/tmp/app/src"
  }

  # Copy package.json
  provisioner "file" {
    source      = "package.json"
    destination = "/tmp/app/package.json"
  }

  # Copy csye6225.service separately
  provisioner "file" {
    source      = "csye6225.service"
    destination = "/tmp/app/csye6225.service"
  }

  provisioner "file" {
    source      = "./src/cloudwatchconfig.json"
    destination = "/tmp/cloudwatchconfig.json"
  }

  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y nodejs npm",

      "wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb -O /tmp/amazon-cloudwatch-agent.deb",
      "[ -f /tmp/amazon-cloudwatch-agent.deb ] || { echo 'Failed to download CloudWatch Agent'; exit 1; }",
      "sudo dpkg -i /tmp/amazon-cloudwatch-agent.deb || sudo apt-get install -f -y",
      "sudo systemctl enable amazon-cloudwatch-agent",

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
      "sudo bash -c 'echo \"PORT=${var.app_port}\" > /opt/csye6225/app/.env'",
      "sudo bash -c 'echo \"NODE_ENV=production\" >> /opt/csye6225/app/.env'",

      # Install dependencies
      "cd /opt/csye6225/app",
      "ls -l package.json || echo 'Error: package.json not found!'", # Debugging
      "sudo npm install",

      # Ensure service setup
      "sudo cp /opt/csye6225/app/csye6225.service /etc/systemd/system/csye6225.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable csye6225.service",

      "sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc",
      "sudo mv /tmp/cloudwatchconfig.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",
      "sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json || { echo 'Failed to configure CloudWatch Agent'; exit 1; }"
    ]
  }
}