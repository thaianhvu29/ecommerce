# E-Commerce DevOps Platform

> Production-oriented e-commerce web application deployed on AWS EC2 with Docker, Docker Compose, Nginx, GitHub Actions CI/CD, Amazon S3, Prometheus and Grafana.

**GitHub:** https://github.com/thaianhvu29/ecommerce

---

## 📌 Overview

This project is a full-stack e-commerce application combined with a practical **DevOps deployment and operations environment**.

The project was built to simulate a real-world workflow where application code is developed, containerized, continuously integrated, automatically deployed to AWS, monitored, and backed up.

The main DevOps workflow is:

```text
Developer
    |
    | Git Push
    v
  GitHub
    |
    v
GitHub Actions
    |
    +----------------+
    |                |
    v                v
   CI               CD
    |                |
    |                v
    |              AWS EC2
    |                |
    |                v
    |         Docker Compose
    |                |
    +---------> Application
                     |
          +----------+----------+
          |          |          |
          v          v          v
       Frontend   Backend    MongoDB
          |          |
          +---- Nginx
                 |
                 v
              Internet
```

The infrastructure is also monitored and backed up:

```text
EC2
 |
 +---- Node Exporter
 |
 +---- cAdvisor
 |
 v
Prometheus
 |
 v
Grafana
 |
 v
Alerting


MongoDB
   |
   v
mongodump
   |
   v
Compressed Backup
   |
   v
Amazon S3
```

---

# 🎯 Project Objectives

The project has two main objectives.

### Application development

Build a functional e-commerce platform with:

* User authentication
* Product management
* Category management
* Shopping cart
* Orders
* Reviews
* Wishlist
* Admin management

### DevOps implementation

Implement a practical production-oriented workflow including:

* Linux server deployment
* Docker containerization
* Docker Compose
* CI/CD
* AWS EC2
* Amazon S3
* Nginx reverse proxy
* Database backup automation
* Prometheus monitoring
* Grafana visualization
* Alerting
* Container health checks
* Bash automation
* Linux Cron

---

# 🏗️ System Architecture

```text
                              INTERNET
                                  |
                                  v
                           +-------------+
                           |    NGINX    |
                           |Reverse Proxy|
                           +------+------+
                                  |
                    +-------------+-------------+
                    |                           |
                    v                           v
             +-------------+             +-------------+
             |  FRONTEND   |             |   BACKEND   |
             | React/Nginx |             | Node/Express|
             +-------------+             +------+------+
                                                |
                                                v
                                         +-------------+
                                         |   MONGODB   |
                                         +-------------+


                         AWS EC2 SERVER
                                |
             +------------------+------------------+
             |                  |                  |
             v                  v                  v
        Application        Monitoring           Backup
             |                  |                  |
       Docker Compose       Prometheus             |
             |                  |                  |
             |               Grafana               |
             |                  |                  |
             |             Alerting                 |
             |                                     |
             +-------------------------------+     |
                                             |     |
                                             v     v
                                          Amazon S3
                                      Images + Backups
```

---

# 🧩 Application Architecture

The application consists of three main services.

```text
+-----------------------+
|       Frontend        |
|     React + Nginx     |
+-----------+-----------+
            |
            | HTTP
            v
+-----------------------+
|        Backend        |
|   Node.js + Express   |
+-----------+-----------+
            |
            | MongoDB Driver
            v
+-----------------------+
|       MongoDB         |
|      Database         |
+-----------------------+
```

## Frontend

The frontend is developed using React.

Main responsibilities:

* Authentication UI
* Product listing
* Product details
* Shopping cart
* Checkout
* Order management
* Wishlist
* User profile
* Admin dashboard

## Backend

The backend is built with Node.js and Express.

Responsibilities:

* REST API
* Authentication
* Authorization
* Product management
* Category management
* Orders
* Cart
* Reviews
* User management
* S3 image upload

## Database

MongoDB is used as the application database.

Main collections include:

```text
users
products
categories
orders
carts
reviews
```

---

# 🐳 Docker Architecture

The application is containerized using Docker.

Docker Compose manages the complete application stack.

```text
docker-compose.yml
│
├── mongodb
│   └── MongoDB 7
│
├── backend
│   └── Node.js / Express
│
├── frontend
│   └── React / Nginx
│
├── nginx
│   └── Reverse Proxy
│
├── prometheus
│   └── Metrics Collection
│
├── grafana
│   └── Visualization + Alerting
│
├── node-exporter
│   └── Host Metrics
│
└── cadvisor
    └── Container Metrics
```

## Container Health Checks

Health checks are configured for the main application services.

### MongoDB

MongoDB is checked using:

```text
mongosh
db.adminCommand('ping')
```

### Backend

The backend exposes a health endpoint:

```text
/api/health
```

Docker verifies the API availability.

### Frontend

The frontend container is checked through HTTP.

This allows Docker Compose to determine whether services are actually healthy rather than simply running.

---

# 🌐 Nginx Reverse Proxy

Nginx acts as the public entry point of the application.

```text
                    Internet
                       |
                       v
                   Port 80
                       |
                       v
                    Nginx
                   /     \
                  /       \
                 v         v
            Frontend      Backend
               |            |
            Port 3000    Port 5000
```

Routing:

```text
/       → Frontend
/api/   → Backend
```

This allows the application to expose a single public endpoint.

Nginx also provides:

* Reverse proxy
* Request forwarding
* Centralized entry point
* Upload size configuration

---

# ☁️ AWS Infrastructure

The application is deployed on **Amazon EC2** running Ubuntu Linux.

## EC2

The EC2 instance hosts:

```text
Docker
Docker Compose
Nginx
Frontend
Backend
MongoDB
Prometheus
Grafana
Node Exporter
cAdvisor
Backup scripts
```

## Amazon S3

Amazon S3 is used for two purposes.

### 1. Product image storage

Product images are uploaded from the backend to S3.

```text
User
 |
 v
Backend
 |
 v
AWS S3
 |
 v
Product Image
```

### 2. MongoDB backup storage

Database backups are automatically uploaded to S3.

```text
MongoDB
   |
   v
mongodump
   |
   v
.tar.gz
   |
   v
Amazon S3
```

---

# 🔄 CI/CD Pipeline

GitHub Actions is used to automate the software delivery process.

```text
Developer
    |
    | git push
    v
 GitHub
    |
    v
GitHub Actions
    |
    +--------------------+
    |                    |
    v                    v
    CI                   CD
    |                    |
    v                    v
Build / Validate       Deploy
                         |
                         v
                       EC2
                         |
                         v
                  Docker Compose
                         |
                         v
                    Application
```

## Continuous Integration

The CI workflow automatically validates the project after changes are pushed to GitHub.

The purpose is to detect problems before deployment.

## Continuous Deployment

After the CI/CD workflow completes successfully, the application is deployed to the EC2 server.

The deployment process uses Docker Compose to update the application containers.

This reduces manual deployment steps and provides a repeatable deployment process.

---

# 💾 Automated MongoDB Backup

MongoDB backup is automated using:

* Bash
* `mongodump`
* Linux Cron
* Amazon S3

Backup process:

```text
              MongoDB
                 |
                 v
             mongodump
                 |
                 v
          Temporary Backup
                 |
                 v
             tar.gz
                 |
                 v
             Amazon S3
                 |
                 v
          Cleanup Temporary
```

The backup script is located in:

```text
scripts/backup-mongodb.sh
```

Cron is configured to execute the backup automatically.

Example:

```text
0 2 * * *
```

This means the backup runs every day at 02:00 according to the server's configured timezone.

---

# 📊 Monitoring & Observability

The project includes a monitoring stack using:

* Prometheus
* Grafana
* Node Exporter
* cAdvisor

Architecture:

```text
                   +----------------+
                   |      EC2       |
                   +-------+--------+
                           |
              +------------+------------+
              |                         |
              v                         v
      +---------------+         +---------------+
      | Node Exporter |         |    cAdvisor   |
      | Host Metrics  |         | Docker Metrics|
      +-------+-------+         +-------+-------+
              |                         |
              +------------+------------+
                           |
                           v
                    +-------------+
                    | Prometheus  |
                    +------+------+
                           |
                           v
                    +-------------+
                    |   Grafana   |
                    +------+------+
                           |
                           v
                       Alerting
```

## Node Exporter

Node Exporter collects host-level metrics such as:

* CPU
* Memory
* Disk
* Network

## cAdvisor

cAdvisor collects Docker container metrics such as:

* Container CPU usage
* Container memory usage
* Container availability
* Container resource consumption

## Prometheus

Prometheus collects and stores metrics from the monitoring components.

## Grafana

Grafana provides:

* Monitoring dashboards
* Metrics visualization
* Alert rules
* Notification configuration

---

# 🚨 Alerting

Grafana Alerting is configured to detect infrastructure and container problems.

Example alert scenario:

```text
Container stops
      |
      v
cAdvisor
      |
      v
Prometheus
      |
      v
Grafana Alert Rule
      |
      v
Contact Point
      |
      v
Notification
```

The project includes monitoring for container availability and infrastructure health.

---

# 🔐 Authentication & Authorization

The application implements authentication using JWT.

Authentication flow:

```text
User
 |
 | Login
 v
Backend
 |
 | Verify credentials
 v
JWT Token
 |
 v
Client
 |
 | Authorization: Bearer <token>
 v
Protected API
```

Admin operations are protected by role-based authorization.

Example:

```text
user
admin
```

Admin users can access management functions such as:

* Product management
* Category management
* Order management
* User management

---

# 🔒 Environment Variables & Secrets

Sensitive configuration is managed through environment variables.

Examples:

```text
JWT_SECRET
MONGODB_URI
AWS_REGION
S3_BUCKET
```

Secrets should never be committed to GitHub.

The `.gitignore` configuration prevents local environment files from being tracked.

---

# 📁 Project Structure

```text
ecommerce/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── utils/
│
├── monitoring/
│   └── prometheus/
│
├── nginx/
│
├── scripts/
│   └── backup-mongodb.sh
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 🚀 Deployment

## Requirements

The deployment server requires:

* Ubuntu Linux
* Docker
* Docker Compose
* Git
* AWS account

## Clone Repository

```bash
git clone https://github.com/thaianhvu29/ecommerce.git
cd ecommerce
```

## Environment Configuration

Create the required environment variables.

Example:

```text
JWT_SECRET=your-secret
AWS_REGION=your-region
S3_BUCKET=your-bucket
```

Do not commit real secrets to GitHub.

## Start Application

```bash
docker compose up -d --build
```

## Check Services

```bash
docker compose ps
```

## View Logs

```bash
docker compose logs -f
```

## Stop Application

```bash
docker compose down
```

---

# 🧰 Useful DevOps Commands

### Check containers

```bash
docker compose ps
```

### Restart application

```bash
docker compose restart
```

### Rebuild application

```bash
docker compose up -d --build
```

### View backend logs

```bash
docker compose logs -f backend
```

### View frontend logs

```bash
docker compose logs -f frontend
```

### View Nginx logs

```bash
docker compose logs -f nginx
```

### View MongoDB logs

```bash
docker compose logs -f mongodb
```

### Check Docker resources

```bash
docker stats
```

---

# 🧪 Troubleshooting Experience

During deployment, several real-world issues were encountered and resolved, including:

* Docker container port conflicts
* Nginx port 80 conflicts
* Docker Compose YAML configuration errors
* GitHub Personal Access Token workflow permission issues
* MongoDB container issues
* Authentication and admin role configuration
* AWS S3 integration
* Cron timezone considerations
* Container health check configuration
* Reverse proxy configuration

These troubleshooting cases were part of the practical deployment process rather than simulated examples.

---

# 🛠️ Technology Stack

## Application

* React
* React Router
* Context API
* Axios
* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Bcrypt
* Multer

## DevOps

* Ubuntu Linux
* Git
* GitHub
* GitHub Actions
* Docker
* Docker Compose
* Nginx
* Bash
* Cron

## AWS

* Amazon EC2
* Amazon S3
* AWS IAM

## Monitoring

* Prometheus
* Grafana
* Node Exporter
* cAdvisor

---

# 📚 DevOps Concepts Demonstrated

This project demonstrates practical understanding of:

### Linux

* Linux server administration
* Processes
* Ports
* Services
* Cron
* Shell scripting
* Logs

### Docker

* Dockerfile
* Images
* Containers
* Volumes
* Networks
* Health checks
* Docker Compose

### CI/CD

* Git workflow
* GitHub Actions
* Continuous Integration
* Continuous Deployment
* Automated deployment

### AWS

* EC2
* S3
* IAM
* Cloud deployment
* Cloud storage

### Networking

* HTTP
* Ports
* Reverse proxy
* Nginx
* Container networking

### Monitoring

* Metrics
* Prometheus
* Grafana
* Node Exporter
* cAdvisor
* Alerting

### Reliability

* Health checks
* Automated backups
* S3 backup storage
* Service restart policies

---

# 🎓 What This Project Demonstrates

The project demonstrates the complete lifecycle of a containerized web application:

```text
Development
     ↓
Git
     ↓
GitHub
     ↓
CI
     ↓
CD
     ↓
AWS EC2
     ↓
Docker Compose
     ↓
Nginx
     ↓
Application
     ↓
Monitoring
     ↓
Alerting
     ↓
Backup
     ↓
Amazon S3
```

The goal is to demonstrate not only how to deploy an application, but also how to **operate, monitor, troubleshoot and maintain it**.

---

# 📈 Future Improvements

Potential future improvements include:

* Docker image registry such as GHCR
* Infrastructure as Code with Terraform
* Automated rollback
* HTTPS with a custom domain
* Centralized logging
* More advanced AWS architecture
* Kubernetes deployment

These are intentionally kept outside the current implementation to keep the project focused on a practical Docker-based DevOps architecture.

---

# 👨‍💻 Author

## Thai Anh Vu

Computer Science / Information Technology

Interested in:

* DevOps
* Cloud Computing
* Linux
* Docker
* CI/CD
* AWS
* Kubernetes

GitHub:

https://github.com/thaianhvu29

---

# ⭐ Project Summary

**E-Commerce DevOps Platform**

A full-stack e-commerce application deployed on AWS with a complete DevOps workflow covering:

**Git → CI/CD → Docker → AWS EC2 → Nginx → S3 → Backup → Prometheus → Grafana → Alerting**

This project was built as a practical demonstration of DevOps engineering skills and production-oriented application operations.

