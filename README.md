# Global Web AI — Marketing Automation Platform
### By GlobalWebSaaS | contact@globalwebsaas.org

AI-powered marketing automation: Meta Ads, Google Ads, LinkedIn, WhatsApp & GMB — one dashboard.

---

## ⚡ Quick Start (10 minutes)

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Set up environment
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in your keys (see below).

### Step 3 — Set up Supabase
1. Go to [supabase.com](https://supabase.com) → Create new project (Mumbai region)
2. Go to SQL Editor → paste contents of `supabase/schema.sql` → Run
3. Copy your Project URL and Anon Key from Settings → API → paste in `.env.local`

### Step 4 — Run locally
```bash
npm run dev
```
Open http://localhost:3000 → Click "Enter Demo Dashboard"

---

## 🔑 API Keys — What to Get First

| Key | Where | Cost | Priority |
|-----|-------|------|----------|
| `ANTHROPIC_API_KEY` | console.anthropic.com | Free credits | **First** |
| `NEXT_PUBLIC_SUPABASE_URL` | supabase.com → Settings → API | Free | **First** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | supabase.com → Settings → API | Free | **First** |
| `META_ACCESS_TOKEN` | developers.facebook.com | Free | When ready |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | ads.google.com → API Centre | Free | When ready |
| `WHATSAPP_TOKEN` | Meta Business Suite | Free (1000 conv/mo) | When ready |
| `RAZORPAY_KEY_ID` | dashboard.razorpay.com | Free (2% fee) | For payments |

---

## 🚀 Demo Mode (Zero setup)

The platform works completely in **demo mode** without any API keys:
- Dashboard shows live-ticking real metrics
- AI Generator returns realistic demo content
- All pages are fully functional
- WhatsApp shows real chat UI

**Use this to pitch clients confidently from day 1.**

---

## 📁 Project Structure

```
globalwebai/
├── app/
│   ├── auth/login/       → Login page (demo button + email)
│   ├── auth/signup/      → Signup page
│   ├── dashboard/        → All dashboard pages
│   │   ├── page.tsx      → Main dashboard (live charts, KPIs)
│   │   ├── campaigns/    → Campaign manager
│   │   ├── ai/           → AI Content Generator (Claude)
│   │   ├── leads/        → Lead CRM & pipeline
│   │   ├── analytics/    → Charts & reports
│   │   ├── whatsapp/     → WhatsApp chat UI
│   │   ├── social/       → Social media scheduler
│   │   └── settings/     → API keys & profile
│   └── api/
│       ├── ai/generate/  → Anthropic Claude endpoint
│       ├── campaigns/    → Campaign CRUD
│       ├── leads/        → Lead CRUD
│       ├── analytics/    → Analytics aggregation
│       ├── social/posts/ → Social post CRUD
│       └── whatsapp/     → WhatsApp send
├── components/
│   ├── Sidebar.tsx       → Navigation sidebar
│   └── Topbar.tsx        → Top navigation bar
├── lib/
│   ├── supabase.ts       → Supabase client
│   ├── anthropic.ts      → Claude AI helpers
│   └── utils.ts          → Helpers, formatters
├── supabase/
│   └── schema.sql        → Run this in Supabase SQL Editor
└── .env.example          → Copy to .env.local

```

---

## 🌐 Deploy to Vercel (Free)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Global Web AI launch"
git remote add origin https://github.com/chouregraicy-rgb/globalwebai.git
git push -u origin main

# 2. Go to vercel.com → Import your repo
# 3. Add all .env.local variables in Vercel → Environment Variables
# 4. Deploy → Your live URL appears in seconds
```

---

## 💰 Business Model (₹20,000/month per client)

| | Per client/month |
|--|--|
| API costs | ~₹800 |
| You charge | ₹20,000 |
| **Your profit** | **₹19,200** |

**10 clients = ₹1.92 lakh/month net**

---

## 📞 Support
- Email: contact@globalwebsaas.org
- Platform: GlobalWebSaaS


---

## 📱 Social Media Auto-Posting Setup

### Facebook Auto-Post (15 min)
1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps) → Your App
2. Add "Pages API" product
3. Generate a Page Access Token for your Page
4. Find your Page ID: go to your Facebook Page → About → Page ID
5. Add to `.env.local`:
   ```
   META_ACCESS_TOKEN=your_page_access_token
   META_PAGE_ID=your_numeric_page_id
   ```

### LinkedIn Auto-Post (20 min)
1. Go to [linkedin.com/developers](https://linkedin.com/developers) → Create App
2. Request "Share on LinkedIn" + "Community Management API" products (1-3 day approval)
3. Generate OAuth access token
4. Get your Person URN: call `https://api.linkedin.com/v2/me` with your token
5. Add to `.env.local`:
   ```
   LINKEDIN_ACCESS_TOKEN=your_access_token
   LINKEDIN_PERSON_ID=your_person_id (numbers only, not urn:li:person:)
   ```

### Instagram Auto-Post (10 min)
1. Connect Instagram Business account to your Facebook Page
2. Get Instagram Business User ID from Meta Business Suite → Instagram → Settings
3. Uses the same META_ACCESS_TOKEN as Facebook
4. Add to `.env.local`:
   ```
   INSTAGRAM_USER_ID=your_instagram_business_user_id
   ```

### Image Upload Setup (optional — 5 min)
1. In Supabase → Storage → Create bucket named `social-images`
2. Set bucket to Public
3. Images will auto-upload and attach to posts

### Once configured:
- Open Social Media page → Create New
- AI writes your content → add image → schedule
- Clicks "Schedule & Auto-Publish" → posts go live automatically at your set time
- "Post Now" button publishes immediately to all selected platforms
