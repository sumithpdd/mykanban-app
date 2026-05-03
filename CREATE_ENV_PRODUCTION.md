# Create .env.production File

## Step-by-Step Instructions

### 1. Copy Your Current Environment File

In PowerShell:
```powershell
Copy-Item .env.local .env.production
```

### 2. Edit .env.production

Open `.env.production` in your editor and make these changes:

**Change NEXTAUTH_URL to production:**
```env
NEXTAUTH_URL=https://mykanban-3cf17.web.app
```

**Change NEXTAUTH_SECRET to the new production secret:**
```env
NEXTAUTH_SECRET=1I1f20GB5ezoUwasxH3WTE/DLkyqdG+vrVbN4T0eRiQ=
```

**Keep everything else the same** (your Google OAuth, Firebase config, TinyMCE should all stay the same)

### 3. Add .env.production to .gitignore

Check that `.env*` is in your `.gitignore` (it should already be there):
```gitignore
.env*
```

### 4. Redeploy to Firebase

```powershell
# Clean previous build
Remove-Item -Recurse -Force .next, .firebase -ErrorAction SilentlyContinue

# Build with production env
npm run build

# Deploy
firebase deploy
```

This will take 5-10 minutes. Watch for:
```
✓ Deploy complete!
Hosting URL: https://mykanban-3cf17.web.app
```

### 5. Update Google OAuth (if not done already)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth Client ID
3. Add to "Authorized redirect URIs":
   ```
   https://mykanban-3cf17.web.app/api/auth/callback/google
   ```
4. Click SAVE

### 6. Test Your App

1. **Clear browser cache completely** (Ctrl+Shift+Delete)
2. Visit: https://mykanban-3cf17.web.app
3. Click "Sign In with Google"
4. Should work now! ✅

## If Still Getting Errors

1. **Check deployed environment variables:**
   ```powershell
   firebase functions:config:get
   ```

2. **Manually set if needed:**
   ```powershell
   firebase functions:config:set nextauth.url="https://mykanban-3cf17.web.app"
   firebase functions:config:set nextauth.secret=""
   
   # Then redeploy
   firebase deploy --only functions
   ```

3. **Check browser console** (F12) for specific errors

4. **Wait 5 minutes** after deploy for changes to propagate

