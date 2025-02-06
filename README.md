# WebApp - Cloud-Native Health Check API

## **Project Overview**

This project is a **cloud-native backend API** built using **Node.js**, **Express**, and **MySQL** with Sequelize ORM. It provides a `/healthz` endpoint to check the health status of the database and downstream API dependencies.

---

## **Table of Contents**

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Running the Application](#running-the-application)
- [Testing the API](#testing-the-api)
- [Pulling Updates from GitHub](#pulling-updates-from-github)
- [Database Verification (SQL Queries)](#database-verification-sql-queries)
- [Stopping the Application](#stopping-the-application)

---

## **Prerequisites**

Ensure you have the following installed on your system:

- **Node.js** (LTS version) - [Download Here](https://nodejs.org/)
- **MySQL** (Installed Locally or via Docker) - [Download Here](https://www.mysql.com/)
- **Git** (For version control) - [Download Here](https://git-scm.com/)

---

## **Project Setup**

### **1. Clone the Repository**

Pull the latest code from GitHub:

```bash
# Clone the repository
git clone git@github.com:CSYE6225CloudSpring2025/webapp.git

# Navigate into the project directory
cd webapp
```

### **2. Set Up Environment Variables**

Create a `.env` file inside the project root and add the following:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=healthcheck
```

Replace `yourpassword` with your actual MySQL password.

### **3. Install Dependencies**

Run the following command to install project dependencies:

```bash
npm install
```

### **4. Setup the Database**

- Start MySQL service (if not running):
  ```bash
  sudo service mysql start  # Linux/macOS
  brew services start mysql  # macOS (Homebrew)
  ```
- Manually create the database if it does not exist:
  ```sql
  CREATE DATABASE healthcheck;
  ```

---

## **Running the Application**

Start the application with:

```bash
npm start
```

Expected output:

```
Server running on http://localhost:8080
Database initialized.
```

---

## **Testing the API**

### **1. Health Check Endpoint**

Run the following `curl` commands to test the API:

#### **✅ Successful Check (200 OK)**

```bash
curl -X GET http://localhost:8080/healthz -v
```

Expected response:

```
HTTP/1.1 200 OK
```

#### **❌ Database Failure (503 Service Unavailable)**

Stop MySQL and test again:

```bash
sudo service mysql stop
curl -X GET http://localhost:8080/healthz -v
```

Expected response:

```
HTTP/1.1 503 Service Unavailable
```

Restart MySQL and re-test:

```bash
sudo service mysql start
```

#### **❌ Invalid Method (405 Method Not Allowed)**

```bash
curl -X POST http://localhost:8080/healthz -v
```

Expected response:

```
HTTP/1.1 405 Method Not Allowed
```

---

## **Pulling Updates from GitHub**

If you need to update your local repository with the latest code changes:

```bash
# Fetch the latest updates
git pull origin main
```

If you are on a different branch and want to switch to the latest version:

```bash
git checkout main
git pull origin main
```

---

## **Database Verification (SQL Queries)**

To manually verify database entries, connect to MySQL:

```bash
mysql -u root -p
```

Run the following SQL query to check inserted health records:

```sql
USE healthcheck;
SELECT * FROM HealthChecks;
```

Expected Output:

```
+---------+---------------------+
| CheckId | datetime            |
+---------+---------------------+
| 1       | 2025-01-29 12:45:00 |
| 2       | 2025-01-29 12:46:00 |
+---------+---------------------+
```

---

## **Stopping the Application**

To stop the running server:

```bash
CTRL + C
```

To stop MySQL (if needed):

```bash
sudo service mysql stop
```

---

## **Conclusion**

You have successfully set up and tested the **Health Check API**. 🚀 If you encounter issues, review the logs or check database connectivity. Happy coding!

# Digital Ocean VM Setup and Usage

## Step-by-Step Guide

### 1. Logging into Digital Ocean VM
To log into your Digital Ocean virtual machine (VM), use SSH:
```sh
ssh -i /Users/priyeshmodi/.ssh/do root@your_server_ip
```
If you have a different user, replace `root` with your username.

If using an SSH key:
```sh
ssh -i /path/to/private_key.pem user@your_server_ip
```

### 2. Uploading Files to Digital Ocean VM
Using SCP (Secure Copy Protocol):
```sh
scp -i ~/.ssh/do setup.sh root@your_server_ip:/root/  

scp /path/to/local/file user@your_server_ip:/path/to/remote/destination
```
Example:
```sh
scp myfile.py root@your_server_ip:/home/root/
```

### 3. Running a Node.js Application
Navigate to the application directory:
```sh
cd /path/to/your/node/app
```
Install dependencies:
```sh
npm install
```
Run the application:
```sh
npm start
```

### 4. Exiting the Digital Ocean VM
To disconnect from the VM, simply type:
```sh
exit
```

## Additional Notes
- Ensure your VM has a static IP or set up a Floating IP for easier access.
- Regularly update your packages and security patches.
- Use screen or tmux for running long scripts without interruption.

This guide should help you set up and manage your Digital Ocean VM efficiently!

