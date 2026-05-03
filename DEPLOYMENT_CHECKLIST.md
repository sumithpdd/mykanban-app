# 🚀 Quick Deployment Checklist

Use this checklist to deploy your MyKanban app to Firebase Hosting.

---

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Ready
- [ ] Have production Firebase credentials
- [ ] Have production Google OAuth credentials  
- [ ] Generated new `NEXTAUTH_SECRET` for production
- [ ] All environment variables documented

### 2. Code Ready
- [ ] All changes committed to git
- [ ] Production build tested locally
- [ ] No console errors
- [ ] All features working

### 3. Firebase Ready
- [ ] Firebase CLI installed: `npm install -g firebase-tools`
- [ ] Logged in: `firebase login`
- [ ] Production Firebase project created
- [ ] Firestore database enabled

---

## 🔥 Deploy to Firebase Hosting (Next.js Support)

Your `firebase.json` is already configured with `frameworksBackend` which provides full Next.js support!

### Step 1: Install Firebase CLI (if not installed)

```powershell
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```powershell
firebase login
```

### Step 3: Select Your Firebase Project

```powershell
# List your projects
firebase projects:list

# Use your project
firebase use your-project-id
```

### Step 4: Set Up Environment Variables

Firebase will use your `.env.local` for the build. Make sure it contains production values.

**For production, create `.env.production`**:

```env
# Copy from .env.local and update with production values
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
NEXTAUTH_SECRET=your_new_production_secret
NEXTAUTH_URL=https://your-project-id.web.app
# ... all other variables with production values
```

### Step 5: Build and Deploy

```powershell
# Build for production (uses .env.production if it exists)
npm run build

# Deploy to Firebase
firebase deploy
```

**This will deploy**:
- ✅ Firestore security rules
- ✅ Firebase Hosting with your Next.js app
- ✅ Server-side functions automatically (for API routes, NextAuth)

### Step 6: Access Your Site

After deployment completes, your app will be live at:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

---

## 🔐 Post-Deployment Configuration

### 1. Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URI:
   ```
   https://your-project-id.web.app/api/auth/callback/google
   https://your-project-id.firebaseapp.com/api/auth/callback/google
   ```
5. Save

### 2. Test Authentication

1. Visit your deployed URL
2. Click "Sign In with Google"
3. Verify it works!

### 3. Update User Approval

1. Go to Firebase Console → Firestore
2. Find your user document
3. Set `isApproved: true`
4. Refresh your app

---

## 🎯 Quick Deploy Command

```powershell
# All in one (from project root)
npm run build && firebase deploy
```

---

## 🔄 Redeploy (After Changes)

```powershell
# 1. Make your changes
# 2. Commit to git (optional but recommended)
git add .
git commit -m "Your changes"

# 3. Build and deploy
npm run build
firebase deploy
```

---

## 🆘 Common Issues

### Issue: "Firebase CLI not found"
```powershell
npm install -g firebase-tools
```

### Issue: "Not logged in"
```powershell
firebase login
```

### Issue: "No project selected"
```powershell
firebase use --add
# Select your project from the list
```

### Issue: "Build fails"
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules, .next
npm install
npm run build
```

### Issue: "OAuth callback error after deployment"
- Make sure you updated Google OAuth redirect URIs with your deployed URL
- Check NEXTAUTH_URL matches your deployed URL

---

## 📊 Verify Deployment

- [ ] Site loads at Firebase URL
- [ ] Sign in with Google works
- [ ] Can create boards
- [ ] Can add tasks
- [ ] Drag and drop works
- [ ] Can create OKRs
- [ ] All features functional

---

## 🎉 You're Live!

Your app is now publicly accessible!

**Next Steps:**
- Share your URL with users
- Set up custom domain (optional)
- Monitor usage in Firebase Console
- Gather user feedback

---

**Need more details?** See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

