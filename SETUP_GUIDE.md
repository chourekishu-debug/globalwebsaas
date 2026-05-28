# Global Web AI — VS Code Setup Guide
# =====================================
# Follow these steps exactly — takes about 10 minutes

## STEP 1 — Download & Extract the ZIP
1. Download GlobalWebAI.zip
2. Right-click → Extract All
3. Extract to: C:\Users\HP\OneDrive\Desktop\GlobalWebAI
   (same place as your other projects)

## STEP 2 — Open in VS Code
1. Open VS Code
2. File → Open Folder
3. Select the "globalwebai" folder (the inner folder, not the zip)
4. Click Open

## STEP 3 — Open Terminal in VS Code
Press: Ctrl + ` (backtick key, top-left of keyboard)
Or: Terminal menu → New Terminal

## STEP 4 — Install Dependencies
Type this in terminal and press Enter:
  npm install

Wait for it to finish (2-3 minutes first time)

## STEP 5 — Create Your Environment File
In VS Code terminal, type:
  copy .env.example .env.local

Then open .env.local and fill in these 3 values FIRST:
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  ANTHROPIC_API_KEY=sk-ant-api03-your_key

(Get Supabase keys from supabase.com → your project → Settings → API)
(Get Anthropic key free from console.anthropic.com)

## STEP 6 — Set Up Supabase Database
1. Go to supabase.com → your project
2. Click SQL Editor (left sidebar)
3. Click New Query
4. Open the file: globalwebai/supabase/schema.sql
5. Copy ALL the text
6. Paste into Supabase SQL Editor
7. Click Run (green button)
8. Should say "Success" at bottom

## STEP 7 — Run the App
In VS Code terminal type:
  npm run dev

Wait for: "Ready - started server on 0.0.0.0:3000"

## STEP 8 — Open in Browser
Go to: http://localhost:3000
Click "Enter Demo Dashboard"

DONE! Platform is running.

## TROUBLESHOOTING
- "npm not found" → Install Node.js from nodejs.org (LTS version)
- "Port 3000 in use" → npm run dev -- --port 3001
- ".env.local not found" → Make sure you copied .env.example correctly
- Supabase errors → Check your URL and key are correct in .env.local

## TO STOP THE SERVER
Press: Ctrl + C in the terminal

## TO START AGAIN NEXT TIME
Just open VS Code → open terminal → npm run dev
(No need to reinstall, just run step 7 again)
