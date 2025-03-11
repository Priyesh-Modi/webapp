variable "aws_region_1" {
  type    = string
  default = "us-east-1"
}

variable "ami_users" {
  type    = list(string)
  default = ["982534395308"] # Replace with actual AWS account IDs
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "source_ami" {
  type    = string
  default = "ami-04b4f1a9cf54c11d0"
}

variable "app_port" {
  type    = string
  default = "8080"
}

variable "repository_url" {
  type    = string
  default = "https://github.com/your/repository.git"
}

variable "node_version" {
  type    = string
  default = "20.x"
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "project_name" {
  type    = string
  default = "csye6225"
}

variable "DB_USER" {
  type    = string
  default = "root"
}

variable "DB_NAME" {
  type    = string
  default = "HealthChecks"
}

variable "DB_PASSWORD" {
  type    = string
  default = "root"
}

variable "gcp_dev_project_id" {
  type        = string
  description = "GCP project ID"
  default     = "webapp-dev-452003"
}

variable "gcp_zone" {
  type        = string
  description = "GCP compute zone"
  default     = "us-east1-d"
}

variable "credentials_file" {
  description = "GCP service account credentials"
}