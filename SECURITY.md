# Security Best Practices

## 🔒 Security Overview

This document outlines security best practices for the MyKanban app and confirms that no sensitive information is hardcoded in the codebase.

## ✅ Security Checklist

### Environment Variables (`.env.local`)

All sensitive configuration is stored in environment variables:

- ✅ `GOOGLE_CLIENT_ID` - Google OAuth credentials
- ✅ `GOOGLE_CLIENT_SECRET` - Google OAuth credentials  
- ✅ `NEXTAUTH_SECRET` - NextAuth.js secret key
- ✅ `NEXTAUTH_URL` - Application URL
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase configuration
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase configuration
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase configuration
- ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase configuration
- ✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase configuration
- ✅ `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase configuration
- ✅ `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - Firebase configuration
- ✅ `NEXT_PUBLIC_TINYMCE_API_KEY` - TinyMCE API key

### Firebase Service Account

For server-side operations (seed scripts), the Firebase Admin SDK uses a service account key file:

- ✅ File: `serviceAccountKey.json` or `.service.json`
- ✅ Location: Project root (NOT committed to git)
- ✅ Access: Via `GOOGLE_APPLICATION_CREDENTIALS` environment variable
- ✅ `.gitignore`: Both files are excluded from version control

## 🚫 What's Excluded from Git

The `.gitignore` file properly excludes:

```gitignore
# Environment files
.env*

# Service account keys
.service.json
serviceAccountKey.json

# Firebase
.firebaserc
firebase-debug.log
.firebase/

# Security-sensitive files
*.pem
```

## ✅ Code Verification

### Firebase Configuration (`src/app/utils/firebaseConfig.ts`)

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
```

**Status:** ✅ All values from environment variables

### NextAuth Configuration (`src/app/api/auth/[...nextauth]/options.ts`)

**Status:** ✅ Uses environment variables for credentials

### Seed Scripts

**Status:** ✅ Read service account from `GOOGLE_APPLICATION_CREDENTIALS` environment variable

## 🔐 Secret Management Best Practices

### 1. Never Commit Secrets

- ❌ Never commit `.env.local`
- ❌ Never commit service account JSON files
- ❌ Never commit API keys in code
- ✅ Use `env-template.txt` with placeholders only

### 2. Environment Variables

**For Development:**
```bash
# Create .env.local (NOT committed)
cp env-template.txt .env.local
# Fill in actual values
```

**For Seed Scripts (PowerShell):**
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccountKey.json"
node data-migration/seed-categories.js
```

### 3. Service Account Key Security

**Download:**
1. Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Save as `serviceAccountKey.json` in project root

**Security:**
- ✅ File is in `.gitignore`
- ✅ Used only via environment variable
- ✅ Never hardcoded in scripts
- ✅ Keep file permissions restrictive (read-only for owner)

### 4. Rotation Policy

**Rotate secrets regularly:**
- Google OAuth credentials: Every 90 days
- Firebase service account keys: Every 6 months
- NextAuth secret: When compromised

## 🚨 If Secrets Are Exposed

### Immediate Actions

1. **Revoke compromised credentials immediately**
   - Firebase: Delete service account or generate new key
   - Google OAuth: Revoke and create new credentials
   - NextAuth: Generate new secret

2. **Remove from git history** (if committed):
   ```bash
   # Use git-filter-repo or BFG Repo-Cleaner
   # Contact GitHub support for complete removal
   ```

3. **Update all environments** with new credentials

4. **Monitor for unauthorized access**

## ✅ Verification Commands

### Check for Hardcoded Secrets

```bash
# Search for potential hardcoded keys (should return no results in code)
grep -r "AIzaSy" src/
grep -r "AKIA" src/
grep -r "sk-" src/
grep -r "pk_" src/
```

### Check .gitignore Coverage

```bash
# Verify .env files are ignored
git check-ignore .env.local  # Should be ignored
git check-ignore serviceAccountKey.json  # Should be ignored
git check-ignore .service.json  # Should be ignored
```

### Check for Committed Secrets

```bash
# Check if any secrets are tracked by git
git ls-files | grep -E '\\.env|\\.service|serviceAccount'
# Should return nothing (all excluded)
```

## 📋 Deployment Security

### Vercel (or Other Platform)

1. **Set environment variables in platform settings**
   - Never include them in `vercel.json` or other config files
   - Use platform's secure environment variable storage

2. **Use production Firebase rules**
   ```bash
   firebase deploy --only firestore:rules --project production
   ```

3. **Enable security features**
   - Enable Firestore security rules
   - Use authentication on all endpoints
   - Implement rate limiting

## 🔍 Regular Security Audits

### Monthly Checklist

- [ ] Review `.gitignore` for completeness
- [ ] Audit environment variables usage
- [ ] Check for new secrets in code
- [ ] Review Firebase security rules
- [ ] Update dependencies for security patches

### Tools

- **npm audit**: Check for vulnerable dependencies
  ```bash
  npm audit
  npm audit fix
  ```

- **git-secrets**: Prevent committing secrets
  ```bash
  git secrets --scan
  ```

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [NextAuth.js Security](https://next-auth.js.org/security)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

## ✅ Current Status

**Last Security Audit:** November 3, 2025

**Status:** All sensitive information is properly secured via environment variables and service account files. No hardcoded secrets detected in codebase.

**Action Items:**
- ✅ All code uses environment variables
- ✅ `.gitignore` properly configured
- ✅ Documentation uses placeholder values
- ✅ Service account keys excluded from git
- ✅ Template file provided for setup

**Security Rating:** ✅ **SECURE**

