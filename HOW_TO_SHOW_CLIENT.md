# How to Show Clients on Your Laptop
# =====================================
# You have 3 options. Option A works TODAY. Option C is permanent.

## OPTION A — Same WiFi Network (Works Today, Zero Cost)
======================================================
WHEN: Both your desktop and laptop are on same WiFi

ON YOUR DESKTOP:
1. Run the app normally: npm run dev
2. Find your desktop's IP address:
   - Open Command Prompt (Win+R → type cmd → Enter)
   - Type: ipconfig
   - Look for "IPv4 Address" under your WiFi
   - It looks like: 192.168.1.XXX
   
3. Update next.config.js — change this line:
   FROM: const nextConfig = { reactStrictMode: true, ...
   TO: Add hostname: '0.0.0.0' so LAN can access

4. Actually, Next.js handles this automatically.
   Just run: npm run dev -- --hostname 0.0.0.0

ON YOUR LAPTOP (same WiFi):
   Open browser → go to: http://192.168.1.XXX:3000
   (Replace XXX with your desktop's actual IP)
   
   The full platform runs on your laptop screen,
   powered by your desktop in the same room.

ADVANTAGE: Instant, free, no deployment needed
LIMITATION: Both devices must be on same WiFi

## OPTION B — Deploy to Vercel (Free, Permanent, Best for Pitching)
====================================================================
WHEN: You want a live URL you can open anywhere, anytime

This gives you a URL like: https://globalwebai.vercel.app
Open it on any laptop, phone, client's computer — always works.

STEPS (one time, takes 10 minutes):

1. Create GitHub account if you don't have one:
   github.com → Sign up (free)

2. Create new repository:
   github.com → New → Name it "globalwebai" → Create

3. In VS Code terminal, type these one by one:
   git init
   git add .
   git commit -m "Global Web AI launch"
   git remote add origin https://github.com/chouregraicy-rgb/globalwebai.git
   git push -u origin main

4. Go to vercel.com → Sign up with GitHub (free)
5. Click "Add New Project"
6. Select your "globalwebai" repository
7. Click Deploy (it auto-detects Next.js)

8. After deploy, go to:
   Project Settings → Environment Variables
   Add all your .env.local variables here

9. Click Redeploy

YOUR LIVE URL: https://globalwebai-chouregraicy-rgb.vercel.app
(Or set a custom domain like globalwebai.in for ₹500/year)

ADVANTAGE: Works anywhere, professional URL, always live
LIMITATION: Need to deploy once (10 minutes)

## OPTION C — Copy the Folder to Laptop (Offline Demo)
=======================================================
WHEN: You want the platform on the laptop itself

1. Copy the entire "globalwebai" folder to laptop
   (via USB drive or OneDrive/Google Drive)

2. On laptop, install Node.js: nodejs.org → LTS version

3. Open VS Code on laptop → open the folder

4. Create .env.local on laptop (copy from desktop)

5. In terminal: npm install → npm run dev

6. Open browser: http://localhost:3000

ADVANTAGE: Works without internet, fully offline
LIMITATION: Needs setup on laptop too (15 minutes)

## RECOMMENDED FOR YOU
======================
SHORT TERM (this week):
  Use Option A — same WiFi.
  Desktop runs the server, laptop shows the client.
  Works perfectly for demos in your office/home.

LONG TERM (before first real client meeting):
  Use Option B — deploy to Vercel.
  Takes 10 minutes. Gives you a permanent URL.
  Open on any device. No dependency on desktop running.
  
  Then when you sit with a client anywhere:
  Just open the URL on your laptop → full demo ready.
  Even works on client's own computer if they want to see.

## BONUS — Make it look like globalwebsaas.org
================================================
Buy the domain: globalwebai.in or globalwebsaas.in
  (from Hostinger or GoDaddy — ₹300-800/year)
  
Connect to Vercel:
  Vercel → Your Project → Domains → Add domain
  
Then your demo URL becomes: https://globalwebai.in
That's when clients see it as a real product, not a demo.
You already own vidhyasaathi.online — same process.
