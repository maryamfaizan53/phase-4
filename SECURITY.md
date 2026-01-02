# Security Policy & Credential Rotation Guide

## 🚨 Immediate Actions Required (If Credentials Were Exposed)

If you've discovered that credentials were committed to version control, follow these steps **immediately**:

### 1. Revoke All Exposed API Keys

#### OpenAI API Key
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Find the exposed key (starts with `sk-proj-`)
3. Click "Revoke" to immediately invalidate it
4. Generate a new key
5. Save it securely (use a password manager, **NOT** in git)

#### OpenRouter API Key
1. Go to [OpenRouter Keys](https://openrouter.ai/keys)
2. Find the exposed key (starts with `sk-or-v1-`)
3. Delete or revoke the key
4. Generate a new key
5. Save it securely

### 2. Reset Database Credentials

#### Neon PostgreSQL
1. Go to [Neon Console](https://console.neon.tech/)
2. Navigate to your project
3. Go to Settings → Reset Password
4. Generate a new password
5. Update your `DATABASE_URL` connection string with the new password
6. **Do NOT commit the new URL** - keep it in `.env` only

### 3. Rotate JWT Secret

```bash
# Generate a new JWT secret (64 characters)
openssl rand -hex 32

# Update backend/.env with the new value
JWT_SECRET_KEY=<new-key-from-above>
```

**IMPORTANT**: After rotating the JWT secret, all existing user sessions will be invalidated and users will need to log in again.

### 4. Update Environment Files

1. Copy `.env.example` to `.env` for both `backend/` and `frontend/`
2. Fill in the NEW credentials (revoked old ones, generated new ones)
3. **Never commit `.env` files** - they should be in `.gitignore`

### 5. Clean Git History (Optional but Recommended)

⚠️ **WARNING**: This rewrites git history. Coordinate with your team first.

If credentials were committed to git, they remain in history even after deleting them. To completely remove them:

```bash
# Install git-filter-repo (if not installed)
# pip install git-filter-repo

# Remove .env files from all git history
git filter-repo --path backend/.env --invert-paths
git filter-repo --path frontend/.env.local --invert-paths

# Force push to remote (THIS REWRITES HISTORY)
git push origin --force --all
git push origin --force --tags
```

**Alternative**: If the repository is public, consider deleting it and creating a new one.

---

## Security Best Practices

### Environment Variables

1. **Never commit `.env` files** to version control
2. Use `.env.example` as templates with placeholder values
3. Store production secrets in:
   - AWS Secrets Manager
   - Azure Key Vault
   - HashiCorp Vault
   - Environment variables in your deployment platform

### Credential Management

| Secret Type | Storage Method | Rotation Frequency |
|-------------|----------------|-------------------|
| Database Passwords | Password manager, env vars | Every 90 days |
| API Keys | Password manager, env vars | Every 90 days or after exposure |
| JWT Secret | Password manager, env vars | Every 180 days |
| Session Secrets | Password manager, env vars | Every 180 days |

### Access Control

1. **Database**:
   - Use read-only credentials for non-admin operations
   - Limit database access to specific IP ranges (use Neon's IP allowlist)
   - Enable SSL/TLS for all database connections

2. **API Keys**:
   - Use project-level keys (not account-level) for OpenAI
   - Set spending limits on API provider dashboards
   - Monitor usage regularly

3. **JWT Tokens**:
   - Use short expiration times (15 minutes for access tokens)
   - Implement refresh token rotation
   - Store tokens securely on client (httpOnly cookies preferred over localStorage)

### Code Security

1. **Dependencies**:
   ```bash
   # Backend (Python)
   pip install safety
   safety check

   # Frontend (Node.js)
   npm audit
   npm audit fix
   ```

2. **Input Validation**:
   - Validate all user inputs on the backend
   - Use Pydantic models for request validation
   - Sanitize inputs to prevent XSS and SQL injection

3. **Rate Limiting**:
   - Implement rate limiting on all API endpoints
   - Currently configured: 100 requests/minute (see `backend/.env`)

### Deployment Security

1. **Production Environment**:
   - Set `DEBUG=False` in production
   - Set `ENV=production`
   - Use HTTPS only (no HTTP)
   - Enable CORS only for trusted origins

2. **Secrets Management**:
   ```bash
   # Example: Using environment variables in production
   export DATABASE_URL="postgresql://..."
   export OPENAI_API_KEY="sk-proj-..."
   export JWT_SECRET_KEY="..."
   ```

3. **Monitoring**:
   - Enable logging for all authentication attempts
   - Monitor failed login attempts
   - Set up alerts for unusual API usage

---

## Security Checklist

Before deploying to production, verify:

### Backend
- [ ] All secrets moved from `.env` to secure secret management system
- [ ] `DEBUG=False` in production
- [ ] Database credentials rotated and stored securely
- [ ] API keys have spending limits enabled
- [ ] JWT secret is 32+ characters (64 recommended)
- [ ] Rate limiting enabled and tested
- [ ] CORS configured with specific origins (no wildcard `*`)
- [ ] SSL/TLS enabled for database connections
- [ ] Dependencies updated (`pip list --outdated`)
- [ ] Security audit passed (`safety check`)

### Frontend
- [ ] API URL points to production backend (not localhost)
- [ ] No hardcoded secrets in code
- [ ] Dependencies updated (`npm outdated`)
- [ ] Security audit passed (`npm audit`)
- [ ] HTTPS enforced (redirect HTTP to HTTPS)
- [ ] Content Security Policy (CSP) headers configured

### Infrastructure
- [ ] Database backups enabled and tested
- [ ] Monitoring and alerting configured
- [ ] Logs are collected and rotated
- [ ] Firewall rules restrict access to necessary ports only
- [ ] SSH keys rotated (if using SSH access)
- [ ] Multi-factor authentication enabled for cloud providers

---

## Reporting Security Issues

If you discover a security vulnerability, please email security@example.com (replace with your email).

**Do not create a public GitHub issue for security vulnerabilities.**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and provide a timeline for fixing the issue.

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Neon Security Best Practices](https://neon.tech/docs/security/security-overview)
- [OpenAI API Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

---

## Version History

- **2026-01-02**: Initial security policy and credential rotation guide created
- **Next Review**: 2026-04-02 (90 days)
