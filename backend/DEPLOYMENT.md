# EduSphere Production Deployment Guide

This guide describes how to deploy the **EduSphere Backend** on an Ubuntu Server with Docker Compose, Nginx, Let's Encrypt SSL, PM2, and automated MongoDB backups.

---

## 1. Prerequisites

- Ubuntu Server 22.04 LTS or 24.04 LTS
- Docker (v24+) & Docker Compose Plugin (v2+)
- Registered Domain pointing to your server's public IP address

---

## 2. Server Setup & Cloning

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Create app directory and clone repository
sudo mkdir -p /var/www/EduSphere
sudo chown -R $USER:$USER /var/www/EduSphere
cd /var/www/EduSphere
git clone https://github.com/rabea-shaban/EduSphere.git .
cd backend
```

---

## 3. Environment Variables Configuration

Create a `.env` file inside the `backend` directory:

```ini
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/edusphere?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_production_jwt_key_here
JWT_EXPIRES_IN=7d

# Payment & Cloud Storage
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Provider Settings
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
```

---

## 4. Let's Encrypt SSL Certificate Setup

```bash
# Install certbot
sudo apt install -y certbot

# Generate SSL certificate for your domain
sudo certbot certonly --standalone -d edusphere.app -d www.edusphere.app

# Copy certificate files to Nginx SSL directory
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/edusphere.app/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/edusphere.app/privkey.pem nginx/ssl/
```

---

## 5. Docker Compose Deployment

Launch the application container stack:

```bash
# Build and run containers in detached mode
docker compose up -d --build

# Verify container statuses
docker compose ps
```

---

## 6. Health Check & API Verification

Check if the application API and reverse proxy are healthy:

```bash
curl http://localhost:5000/api/v1/
# Expected Output: {"success":true,"message":"EduSphere Backend Running Successfully"}
```

---

## 7. PM2 Alternative (Bare Metal Deployment)

If running outside Docker:

```bash
# Build TypeScript
npm run build

# Start cluster mode using PM2
npx pm2 start ecosystem.config.js --env production
npx pm2 save
npx pm2 startup
```

---

## 8. Automated Database Backups (Cron Setup)

To execute database backups daily at 2:00 AM:

```bash
# Edit crontab
crontab -e

# Add the following entry:
0 2 * * * /var/www/EduSphere/backend/scripts/backup.sh >> /var/log/mongodb_backup.log 2>&1
```
