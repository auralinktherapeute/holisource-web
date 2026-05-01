# 🚀 Holisource Web — Deployment Guide

## ⚡ Option 1: Netlify Auto-Deploy (Recommended)

**Time**: 5 minutes

### Step 1: Push to GitHub

```bash
cd /Users/geraldhenry/claude/holisource-web

# Initialize git (if not done)
git init
git add .
git commit -m "Initial Holisource web MVP"

# Create GitHub repo and push
# (assuming you have gh CLI installed)
gh repo create holisource-web --public
git push -u origin main
```

### Step 2: Connect Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub**, choose **holisource-web**
4. Choose branch: **main**
5. Build settings (should auto-fill):
   - Build command: `npm run build`
   - Publish directory: `dist`

### Step 3: Add Environment Variables

In Netlify Dashboard:
- Go to **Site settings** → **Build & deploy** → **Environment**
- Click **Edit variables**
- Add:
  ```
  VITE_SUPABASE_URL = https://dqmujlqxpmcwscztrrdt.supabase.co
  VITE_SUPABASE_ANON_KEY = <copy from Supabase Settings → API Keys → Anon Key>
  ```

### Step 4: Deploy

- Click **"Deploy"**
- Wait ~2 minutes for build
- Get automatic URL (e.g., `https://holisource-web-123abc.netlify.app`)

### Step 5: Connect Custom Domain

1. In Netlify: **Domain settings** → **Add custom domain**
2. Add **www.holisource.com**
3. Follow DNS setup (Netlify will guide you)
4. Update domain registrar to point to Netlify nameservers

---

## ⚡ Option 2: Manual Deploy (Netlify CLI)

**Time**: 2 minutes (if already have account)

```bash
# Install Netlify CLI (one-time)
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

---

## ✅ Verify Deployment

After deploy, check:

```bash
curl -I https://www.holisource.com
# Should return HTTP 200 ✅

# Check if Supabase is working
# Visit: https://www.holisource.com/therapeutes
# Should show therapist list from Supabase
```

---

## 🔄 Post-Deployment

### Update holisource.com DNS

Current: Points to empty Netlify site  
New: Points to your new **holisource-web** deploy

**Do this in your domain registrar:**

1. Update **A records** to Netlify IPs
2. Update **CNAME www** to Netlify domain
3. Wait 15-30 min for propagation

### Redirect Old Site

If old site was at another provider:
- Old → New redirect at old provider
- Or use Netlify's domain setup

---

## 🐛 Troubleshooting

### "Build failed"
- Check **Build logs** in Netlify Dashboard
- Usually missing env vars
- Verify `VITE_SUPABASE_ANON_KEY` is set

### "Therapist list not showing"
- Check browser console for errors
- Verify Supabase URL + Anon Key are correct
- Test locally first: `npm run dev`

### "Custom domain not working"
- DNS takes 15-30 min to propagate
- Check domain registrar settings
- Verify Netlify certificate is provisioned

---

## 📋 Checklist

- [ ] Repo created on GitHub
- [ ] Netlify site connected
- [ ] Environment variables added
- [ ] Build successful
- [ ] Therapist listing working
- [ ] Custom domain configured
- [ ] DNS propagated (check with `nslookup www.holisource.com`)

---

**Status**: 🟢 Ready for Production  
**Date**: 2026-04-23
