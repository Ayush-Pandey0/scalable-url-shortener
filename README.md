# Scalable URL Shortener

A production-ready URL shortener built to handle high traffic using a modern, scalable architecture. This project uses Node.js, Express, MySQL for persistent storage, Redis for high-speed caching, and NGINX as a load balancer spanning multiple Node.js instances managed by PM2.

## 🚀 Features

- **URL Shortening:** Converts long URLs into short, easy-to-share links.
- **Fast Redirects:** Uses Redis caching to serve heavily accessed links instantly, bypassing the database.
- **Click Analytics:** Tracks the number of clicks and provides a dedicated endpoint for insights.
- **Load Balancing:** Uses NGINX to distribute traffic across multiple Node.js instances.
- **Process Management:** PM2 running in cluster mode ensuring high availability and automatic restarts.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Caching:** Redis (running via Docker)
- **Load Balancer:** NGINX (running via Docker)
- **Process Manager:** PM2

## ⚙️ Architecture

1. **Client** makes an HTTP request to **NGINX** (Port 80).
2. **NGINX** forwards the request to one of the 3 Node.js instances (Ports 3001, 3002, 3003) managed by **PM2**.
3. **Node.js** checks **Redis** for the shortened URL (Cache Hit).
4. If not found in Redis, it queries **MySQL** (Cache Miss), caches the result in Redis, and redirects the user.

## 📦 Run Locally

### 1. Prerequisites
- Node.js (v18+)
- Docker & Docker Desktop
- MySQL Server

### 2. Install Dependencies
```bash
npm install
npm install -g pm2
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=url_shortener

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Start Infrastructure (Docker)
Start the Redis and NGINX containers:
```bash
docker run --name my-redis -p 6379:6379 -d redis
docker run --name my-nginx -p 80:80 -v ${PWD}/nginx.conf:/etc/nginx/nginx.conf:ro -d nginx
```

### 5. Start the Application
Start the Node.js instances using PM2:
```bash
pm2 start ecosystem.config.cjs
```

## 📡 API Endpoints

### 1. Create Short URL
**POST** `http://localhost/shorten`
```json
{
  "originalUrl": "https://example.com"
}
```

### 2. Redirect to Original URL
**GET** `http://localhost/:code`
- Redirects seamlessly to the original URL.
- Ex: `http://localhost/fSmTqd`

### 3. Get Analytics
**GET** `http://localhost/analytics/:code`
```json
{
  "success": true,
  "data": {
    "shortCode": "fSmTqd",
    "originalUrl": "https://example.com",
    "clicks": 5,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```
