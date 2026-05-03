# Fix: Too Many Redirects Error

## Problem
NextAuth is redirecting to `localhost:3000` instead of your production URL, causing a redirect loop.

## Solution: Set Environment Variables in Firebase

### Option 1: Quick Fix - Set Environment Variables via Firebase CLI

```powershell
# Generate a new production secret
node generate-secret.js

# Set the environment variables
firebase functions:config:set nextauth.url="https://mykanban-3cf17.web.app"
firebase functions:config:set nextauth.secret="YOUR_NEW_SECRET_HERE"

# Redeploy
firebase deploy --only functions
```

### Option 2: Set via Google Cloud Console (Recommended)

1. Go to [Google Cloud Console - Cloud Functions](https://console.cloud.google.com/functions/list?project=mykanban-3cf17)

2. Click on your function: `ssrmykanban3cf17`

3. Click **"EDIT"** at the top

4. Scroll down to **"Runtime, build, connections and security settings"** and expand it

5. Click **"ADD VARIABLE"** under "Runtime environment variables"

6. Add these variables:
   ```
   NEXTAUTH_URL = https://mykanban-3cf17.web.app
   NEXTAUTH_SECRET = [generate new secret with: node generate-secret.js]
   GOOGLE_CLIENT_ID = [your Google OAuth client ID]
   GOOGLE_CLIENT_SECRET = [your Google OAuth client secret]
   ```

7. Add all your `NEXT_PUBLIC_FIREBASE_*` variables as well

8. Click **"NEXT"** → **"DEPLOY"**

9. Wait 3-5 minutes for deployment to complete

### Option 3: Create .env.production and Redeploy

1. Copy your `.env.local` to `.env.production`

2. Update `NEXTAUTH_URL`:
   ```env
   NEXTAUTH_URL=https://mykanban-3cf17.web.app
   ```

3. Generate new `NEXTAUTH_SECRET`:
   ```powershell
   node generate-secret.js
   ```

4. Redeploy:
   ```powershell
   firebase deploy
   ```

### Don't Forget: Update Google OAuth

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)

2. Click your OAuth 2.0 Client ID

3. Under **"Authorized redirect URIs"**, add:
   ```
   https://mykanban-3cf17.web.app/api/auth/callback/google
   https://ssrmykanban3cf17-ovwo773sya-ew.a.run.app/api/auth/callback/google
   ```

4. Click **"SAVE"**

---

## Quick Test After Fix

1. Clear your browser cache and cookies for `mykanban-3cf17.web.app`

2. Visit: https://mykanban-3cf17.web.app

3. Click "Sign In with Google"

4. Should redirect properly now!

---

## Why This Happened

Firebase Functions need environment variables set separately from your local `.env.local` file. During deployment, it used default values which pointed to localhost.

The fix ensures NextAuth knows to use your production URL for all redirects.

