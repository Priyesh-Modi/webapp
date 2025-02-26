packer {
  required_plugins {
    amazon = {
      version = ">1.0.0, < 2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
    googlecompute = {
      version = ">= 0.3.0"
      source  = "github.com/hashicorp/googlecompute"
    }
    # googlecompute = {
    #   version = ">=1.0.0"
    #   source  = "github.com/hashicorp/googlecompute"
    # }
  }
}

source "amazon-ebs" "ubuntu" {
  region        = var.aws_region
  instance_type = var.instance_type
  ami_users     = var.ami_users
  source_ami    = var.source_ami
  ssh_username  = var.ssh_username
  ami_name      = "${var.project_name}-ami-{{timestamp}}"
}

# source "googlecompute" "ubuntu" {
#   project_id        = var.gcp_project_id
#   source_image      = "ubuntu-2404-lts"
#   # source_image      = "ubuntu-2204-jammy-v20240207"
#   source_image_family = "ubuntu-2404-lts"
#   machine_type      = "n1-standard-1"
#   zone              = var.gcp_zone
#   image_name        = "custom-ubuntu-node-mysql"
#   image_family      = "custom-node-mysql"
#   ssh_username    = "ubuntu"
#   image_description = "Ubuntu 24.04 LTS custom image with Node.js and MySQL"
#   labels = {
#     environment = "dev"
#   }
# }

source "googlecompute" "gcp-image" {
  project_id              = var.gcp_project_id
  source_image            = "ubuntu-2404-noble-amd64-v20250214"
  source_image_family     = "ubuntu-2404-noble-amd64"
  zone                    = var.gcp_zone
  machine_type            = "n1-standard-1"
  disk_size               = 10
  disk_type               = "pd-standard"
  network                 = "default"
  tags                    = ["csye6225"]
  image_project_id        = var.gcp_project_id
  image_description       = "Custom Ubuntu 20.04 server image"
  image_storage_locations = ["us"]
  image_name              = "csye6225-webapp-ami"
  image_family            = "csye6225-webapp-images"
  ssh_username            = "ubuntu"
}

