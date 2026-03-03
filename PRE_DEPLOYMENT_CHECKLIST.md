# Pre-Deployment Checklist

Use this checklist before deploying to production.

## 🔒 Security Setup

- [ ] **Set JWT_SECRET** - Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] **Set COOKIE_SECURE=true** - Enable HTTPS-only cookies
- [ ] **Set COOKIE_SAME_SITE=strict** - Restrict cross-site cookies
- [ ] **Set ENFORCE_ORIGIN_CHECK=true** - Strict origin validation
- [ ] **Set NODE_ENV=production** - Enable production optimizations
- [ ] **FRONTEND_ORIGINS** - Update with your domain(s)
- [ ] **FRONTEND_URL** - Update with your deployment URL
- [ ] **SENDGRID_API_KEY** - Verify API key is valid
- [ ] **If using HTTPS:** Verify SSL certificate is valid
- [ ] **Password requirements:** Verified 8-char minimum with letter+number

## 🗄️ Database Setup

- [ ] **DATABASE_URL** - Configured with SSL requirement
- [ ] **Run migrations:** `npm run db:migrate`
- [ ] **Backup before migration** - Save database state
- [ ] **Verify connection** - Test database access from production server
- [ ] **Enable backups** - Automated daily backups configured

## 🧪 Testing

### Functional Tests
- [ ] Register new user → Verify email works
- [ ] Login with credentials → Redirects to dashboard
- [ ] Forgot password → Receive reset link → Reset works
- [ ] Admin can manage users → Roles update
- [ ] Rate limiting appears after 10+ failed logins
- [ ] CSRF tokens prevent form tampering
- [ ] Input validation rejects invalid emails
- [ ] Password validation enforces 8+ chars + letter + number

### Security Tests  
- [ ] CSP headers present: `curl -I https://yourdomain.com | grep Content-Security`
- [ ] CSRF tokens working: Forms include X-CSRF-Token header
- [ ] Cookies have Secure flag (in HTTPS): Browser dev tools
- [ ] Rate limiting blocks excess requests
- [ ] 404 on image URLs gone: Check all auth pages load correctly

### Performance Tests
- [ ] API response time < 500ms: Browser Network tab
- [ ] Database queries are indexed: Check slow query log
- [ ] Images load quickly: Check leftSideImage.jpg
- [ ] Rate limiting doesn't block legitimate users

## 🌐 Deployment

### Backend
- [ ] Code pushed to production repository
- [ ] Dependencies installed: `npm ci --only=production`
- [ ] Environment variables set in .env
- [ ] Database migrations run: `npm run db:migrate`
- [ ] Server starts without errors: `npm start`
- [ ] Health check responds: `curl https://api.yourdomain.com/api/health`

### Frontend
- [ ] Build succeeds: `npm run build`
- [ ] No build warnings in console
- [ ] dist/ folder size < 500KB gzipped
- [ ] Source maps uploaded (for error tracking)
- [ ] Static files uploaded to CDN/server

### Nginx (if using)
- [ ] SSL certificate installed and valid
- [ ] Nginx config deployed: /etc/nginx/sites-available/yourdomain
- [ ] Nginx tests: `nginx -t`
- [ ] Nginx reloaded: `systemctl reload nginx`
- [ ] HSTS header configured: `Strict-Transport-Security`

## 📊 Monitoring Setup

- [ ] Health endpoint monitored: `GET /api/health` every 60s
- [ ] Error logs configured: Send to file or service
- [ ] Database monitored: Connection pool, query times
- [ ] Email sending monitored: Check SendGrid delivery
- [ ] Alerts configured: PagerDuty, Slack, etc.

## 🔐 Final Security Check

- [ ] No secrets in git history: `git log --all -p | grep -i secret`
- [ ] Environment variables not logged: Check logs don't contain sensitive data
- [ ] CORS whitelist correct: Only your domain(s)
- [ ] Admin account created: Test admin dashboard access
- [ ] Rate limits appropriate: Based on expected traffic
- [ ] CSRF protection verified: Reject requests without token

## 📋 Post-Deployment (Day 1)

- [ ] Monitor error logs hourly
- [ ] Test full login flow
- [ ] Test admin dashboard
- [ ] Verify email delivery (at least 5 test accounts)
- [ ] Check SSL certificate validity
- [ ] Verify backups completed
- [ ] Review performance metrics
- [ ] Document any issues

## 📋 Post-Deployment (Week 1)

- [ ] Review logs for errors
- [ ] Check rate limiting stats
- [ ] Verify database size growth normal
- [ ] Test disaster recovery (restore from backup)
- [ ] Monitor performance trends
- [ ] Schedule security audit
- [ ] Document any customizations made

## 📞 Emergency Contacts

- [ ] Ops team contact
- [ ] Database admin contact
- [ ] Email provider support
- [ ] SSL certificate provider

## 📅 Maintenance Schedule

- [ ] Daily: Check error logs, verify health endpoint
- [ ] Weekly: Review performance metrics, check backup completion
- [ ] Monthly: Security audit, update dependencies, test disaster recovery
- [ ] Annually: Penetration test, security review, secrets rotation

---

## Quick Links

- **Deployment Guide:** See DEPLOYMENT.md
- **Audit Report:** See AUDIT_REPORT.md
- **Validator Rules:** See frontend/src/validators.js
- **CSRF Implementation:** See server/middleware/csrf.middleware.js

---

**Setup Time:** ~2-3 hours  
**Testing Time:** ~1-2 hours  
**Total Pre-Deployment:** ~4-5 hours

Once you've completed all items above, you're ready to deploy! 🚀
