# 🌐 Holisource Web — Site Public

**Status**: ✅ **MVP Ready for Deployment**

Site public Holisource.com — Homepage, listing thérapeutes, profils, inscriptions.

---

## 🚀 Quick Start

### Local Development

```bash
cd /Users/geraldhenry/claude/holisource-web

# Install dependencies
npm install

# Start dev server
npm run dev
# → Open http://localhost:5173
```

### Build for Production

```bash
npm run build
# → Output: dist/
```

---

## 📦 Features (MVP)

- ✅ **Homepage** — Hero + CTA + Features
- ✅ **Therapist Listing** — Grid with Supabase fetching, search/filter
- 🔄 **Therapist Profile** — Placeholder (structure ready)
- 🔄 **Registration Form** — Placeholder (structure ready)
- ✅ **Responsive Design** — Mobile-first
- ✅ **Holisource Colors** — Purple + Cyan gradient

---

## 🔌 Environment Variables

Create `.env.local`:

```
VITE_SUPABASE_URL=https://dqmujlqxpmcwscztrrdt.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key-here>
```

---

## 📋 Deployment on Netlify

### Option 1: Git + Auto-Deploy

1. Push to GitHub:
   ```bash
   git init
   git remote add origin https://github.com/YOUR-ORG/holisource-web.git
   git push -u origin main
   ```

2. Netlify Dashboard → **Add new site** → **Import from Git**

3. Select repo, branch **main**

4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

5. **Environment variables**:
   - `VITE_SUPABASE_URL`: `https://dqmujlqxpmcwscztrrdt.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: *(from Supabase Settings)*

---

## 📁 Structure

```
src/
├── pages/          (HomePage, TherapistListPage, etc.)
├── components/     (Navigation, etc.)
└── lib/            (Supabase client)
```

---

## ✅ Tech Stack

- React 18 + TypeScript + Vite
- React Router v6
- Supabase (PostgreSQL)
- Netlify hosting
- CSS Grid + Flexbox

---

**Created** 2026-04-23 ✅
