# Production Deployment Guide

## Overview
This guide covers deploying the Auth Platform to production with security best practices, performance optimization, and monitoring setup.

## Pre-Deployment Checklist

### 1. Environment Variables

**Backend (.env):**
```dotenv
# Server
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@prod-db.example.com:5432/auth_db?sslmode=require

# Security
JWT_SECRET=<generate-with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_EXPIRES_IN=15m
REFRESH_EXPIRES_DAYS=7
BCRYPT_SALT_ROUNDS=10

# Rate Limiting (adjust for expected traffic)
RATE_LIMIT_MAX=200
AUTH_RATE_LIMIT_MAX=30
AUTH_STRICT_RATE_LIMIT_MAX=10

# Email
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# CORS & Origin
FRONTEND_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
FRONTEND_URL=https://yourdomain.com
ENFORCE_ORIGIN_CHECK=true

# Cookies
COOKIE_SAME_SITE=strict
COOKIE_SECURE=true

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Expiration Times
VERIFY_CODE_EXPIRES_MINUTES=10
RESET_TOKEN_EXPIRES_MINUTES=60
```

**Frontend (.env):**
```dotenv
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 2. Database Migrations
```bash
# Run pending migrations before deployment
npm run db:migrate
```

### 3. Security Checklist
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] COOKIE_SECURE=true in production
- [ ] COOKIE_SAME_SITE=strict
- [ ] ENFORCE_ORIGIN_CHECK=true
- [ ] FRONTEND_ORIGINS configured correctly
- [ ] No secrets in git history
- [ ] Database requires SSL connection
- [ ] Rate limiting configured appropriately
- [ ] CSP headers enabled (already configured)
- [ ] CSRF protection enabled
- [ ] Input validation on both client and server
- [ ] Error messages don't expose internal details

## Deployment Steps

### Backend Deployment

#### Option 1: Docker
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
```

Build and push:
```bash
docker build -t auth-server:latest .
docker push your-registry/auth-server:latest
```

#### Option 2: Direct Server
```bash
# 1. Clone repository
git clone https://github.com/yourorg/auth-platform.git
cd auth-platform

# 2. Install production dependencies only
npm ci --only=production

# 3. Run migrations
npm run db:migrate

# 4. Start with PM2 for process management
npm install -g pm2
pm2 start server.js --name "auth-server" --instances max
pm2 save
pm2 startup
```

### Frontend Deployment

#### Build
```bash
cd frontend
npm run build
```

This creates a `dist/` folder optimized for production.

#### Option 1: CDN + Static Host
```bash
# Build output is tree-shaken and minified
npm run build

# Upload dist/ to S3, CloudFront, Vercel, Netlify, etc.
aws s3 sync dist/ s3://your-bucket/ --delete
```

#### Option 2: Self-Hosted
```bash
# Install global HTTP server or use Express
npm install -g serve
serve -s dist -l 3000
```

#### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - fallback to index.html
    location / {
        root /var/www/app/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests
    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring & Logging

### Backend Logging
Add logging to server.js:
```javascript
// server.js
import logger from './server/middleware/logger.js'; // Create this module

app.use(logger); // Log all requests
```

**Create server/middleware/logger.js:**
```javascript
export default function logger(req, res, next) {
  const start = Date.now();
  const { method, path, query } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    
    if (status >= 400) {
      console.error(`[${new Date().toISOString()}] ${method} ${path} - ${status} - ${duration}ms`);
    } else {
      console.log(`[${new Date().toISOString()}] ${method} ${path} - ${status} - ${duration}ms`);
    }
  });

  next();
}
```

### Health Check Endpoint
Already implemented: `GET /api/health` returns `{ status: "ok" }`

Monitor:
```bash
curl -X GET https://api.yourdomain.com/api/health
```

### Error Tracking
Install Sentry for production error monitoring:

**Backend:**
```bash
npm install @sentry/node
```

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Frontend:**
```bash
npm install @sentry/react @sentry/tracing
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENVIRONMENT,
  tracesSampleRate: 0.1,
});
```

## Performance Optimization

### Backend
1. **Connection Pooling** - Database connections already managed by Drizzle
2. **Compression** - Add express compression:
   ```javascript
   import compression from 'compression';
   app.use(compression());
   ```

3. **Caching** - Auth endpoints set `Cache-Control: no-store` (already done)

### Frontend
1. **Build Optimization** - Vite handles tree-shaking and minification
2. **Code Splitting** - Already implemented with React Router
3. **Image Optimization** - Optimize `/public/leftSideImage.png`
4. **Lazy Loading** - Consider lazy-loading admin dashboard:
   ```javascript
   const AdminDashboard = lazy(() => import('./AdminDashboard'));
   ```

## Backup & Recovery

### Database Backups
```bash
# Daily automated backup (add to cron)
pg_dump postgresql://user:password@host/auth_db | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore from backup
gunzip < backup_20240115.sql.gz | psql postgresql://user:password@host/auth_db
```

## SSL/TLS Certificate

Use Let's Encrypt (free):
```bash
# Install certbot
apt-get install certbot python3-certbot-nginx

# Create certificate
certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (runs daily)
certbot renew --quiet
```

## Testing Production

1. **Test login flow**
   - Register new account
   - Verify email
   - Login
   - Access dashboard

2. **Test forgot password**
   - Request reset
   - Receive email
   - Reset password
   - Login with new password

3. **Test rate limiting**
   ```bash
   for i in {1..35}; do curl -X POST https://api.yourdomain.com/api/auth/login; done
   # Should be rate-limited after 30 attempts
   ```

4. **Test CSRF protection**
   - Ensure all form submission includes CSRF token
   - Test with curl (should fail without token)

5. **Check security headers**
   ```bash
   curl -I https://yourdomain.com
   # Should see: Strict-Transport-Security, X-Content-Type-Options, CSP, etc.
   ```

## Troubleshooting

### Database Connection Issues
```
Error: ECONNREFUSED
- Check DATABASE_URL is correct
- Verify database is running and accessible
- Check firewall rules allow connection
```

### JWT Token Errors
```
Error: "Invalid token"
- Verify JWT_SECRET matches between deployments
- Check token expiration times in .env
- Ensure refresh token endpoint is accessible
```

### CORS Errors
```
Error: "CORS origin not allowed"
- Add domain to FRONTEND_ORIGINS
- Ensure ENFORCE_ORIGIN_CHECK=true
- Check browser is sending correct origin header
```

### Email Not Sending
```
Error: "Failed to send email"
- Verify SENDGRID_API_KEY is valid
- Check EMAIL_FROM domain is verified in SendGrid
- Ensure user email is valid format
```

## Post-Deployment

1. **Monitor logs** for errors
2. **Test email delivery** - Send test verification code
3. **Verify rate limiting** works
4. **Check SSL certificate** validity
5. **Monitor database** performance
6. **Set up alerts** for errors/downtime
7. **Document any customizations** made
8. **Plan database backup strategy**
9. **Schedule security updates** (monthly)
10. **Review logs weekly** for suspicious activity

## Rollback Plan

If critical issue occurs:
1. Restore previous environment variables
2. Roll back database to last backup
3. Deploy previous Docker image or git commit
4. Test thoroughly before re-deploying new version

## Security Hardening

- [ ] Keep Node.js and dependencies updated
- [ ] Run regular `npm audit` for vulnerabilities
- [ ] Enable database encryption at rest
- [ ] Implement WAF rules (rate limiting, IP blocking)
- [ ] Regular security audits (monthly)
- [ ] Employee access controls (who can deploy)
- [ ] Secrets rotation (JWT_SECRET annually)
- [ ] Penetration testing (quarterly)

---

**Last Updated:** 2026
**Version:** 1.0.0
