# DEPLOY GUIDE — Valen's Blog
# ================================

## Step 1 — Supabase setup
1. Go to Supabase → SQL Editor
2. Copy and run the entire SUPABASE_SETUP.sql file

## Step 2 — Get your Supabase keys
Go to Settings → API Keys:
- NEXT_PUBLIC_SUPABASE_URL = https://qhwhqlftmtceaxsuhpqq.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_6lt2S0SFoCHd4tApBUroTA_TbBSnKZT
- SUPABASE_URL = https://qhwhqlftmtceaxsuhpqq.supabase.co
- SUPABASE_SERVICE_KEY = [your secret key — from Settings → API Keys → Secret keys]

## Step 3 — Set environment variables in Vercel
Go to your Vercel project → Settings → Environment Variables, add:

NEXT_PUBLIC_SUPABASE_URL=https://qhwhqlftmtceaxsuhpqq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_6lt2S0SFoCHd4tApBUroTA_TbBSnKZT
SUPABASE_URL=https://qhwhqlftmtceaxsuhpqq.supabase.co
SUPABASE_SERVICE_KEY=your_secret_key_here
ADMIN_PASSWORD=choose_a_strong_password_here
SESSION_SECRET=any_long_random_string_here_eg_abc123xyz456

## Step 4 — Deploy to Vercel
1. Push this folder to a new GitHub repo
2. Go to vercel.com → New Project → Import that repo
3. Vercel auto-detects Next.js, just click Deploy

## Step 5 — Access admin
Go to: yoursite.vercel.app/admin
Password: whatever you set in ADMIN_PASSWORD

## Security checklist ✅
- [x] API keys only in server-side env vars
- [x] All inputs sanitized (DOMPurify)
- [x] Rate limiting on all API routes
- [x] Admin protected by httpOnly cookie
- [x] File upload type validation
- [x] SQL injection impossible (Supabase client)
