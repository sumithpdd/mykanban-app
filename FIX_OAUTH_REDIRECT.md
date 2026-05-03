# Fix OAuth Redirect Issue - Set Environment Variables in Cloud Run

## The Problem
Firebase Functions v2 uses Cloud Run, which doesn't automatically read `.env` files. You need to set environment variables directly in Google Cloud Console.

## Solution: Set Environment Variables in Cloud Run

### Step 1: Open Your Cloud Run Service

1. **Click this link**: [Your Cloud Run Service](https://console.cloud.google.com/run/detail/europe-west1/ssrmykanban3cf17/metrics?project=mykanban-3cf17)

   Or manually:
   - Go to: https://console.cloud.google.com/run
   - Select project: **mykanban-3cf17**
   - Click service: **ssrmykanban3cf17**

### Step 2: Edit the Service

1. Click **"EDIT & DEPLOY NEW REVISION"** button at the top

2. Scroll down to **"Container, Networking, Security"** section

3. Click the **"VARIABLES & SECRETS"** tab

### Step 3: Add Environment Variables

Click **"+ ADD VARIABLE"** and add these one by one:

```
Name: NEXTAUTH_URL
Value: https://mykanban-3cf17.web.app

Name: NEXTAUTH_SECRET  
Value: 

Name: GOOGLE_CLIENT_ID
Value: [Your Google OAuth Client ID - copy from .env.local]

Name: GOOGLE_CLIENT_SECRET
Value: [Your Google OAuth Client Secret - copy from .env.local]

Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: [Copy from .env.local]

Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: mykanban-3cf17.firebaseapp.com

Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: mykanban-3cf17

Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: mykanban-3cf17.appspot.com

Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: [Copy from .env.local]

Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: [Copy from .env.local]

Name: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
Value: [Copy from .env.local]

Name: NEXT_PUBLIC_TINYMCE_API_KEY
Value: [Copy from .env.local]
```

### Step 4: Deploy

1. Click **"DEPLOY"** at the bottom

2. Wait 2-3 minutes for the new revision to deploy

3. You'll see a green checkmark when complete

### Step 5: Verify Google OAuth Redirect URI

Make sure you have this in Google Cloud Console - Credentials:
```
https://mykanban-3cf17.web.app/api/auth/callback/google
```

### Step 6: Test

1. **Clear browser cache completely** (Ctrl+Shift+Delete → All time)
2. Visit: https://mykanban-3cf17.web.app
3. Click "Sign In with Google"
4. **Should work now!** ✅

---

## Quick Command to Get Your Values

Run this in PowerShell to see your current values:

```powershell
Get-Content .env.local | Select-String "GOOGLE_CLIENT_ID|GOOGLE_CLIENT_SECRET|FIREBASE|TINYMCE"
```

Then copy each value to Cloud Run.

---

## Why This is Necessary

Firebase Functions v2 uses Cloud Run under the hood. Cloud Run doesn't automatically bundle `.env` files with deployments. You must set environment variables directly in the Cloud Run console.

This is a one-time setup - once set, they persist across deployments.

