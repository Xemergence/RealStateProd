# HomeHub - Vercel Deployment Guide

## Prerequisites
1. Git repository with your code
2. Vercel account (free tier works)
3. Environment variables ready

## Deployment Steps

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Select the repository containing your HomeHub code

### 2. Configure Project Settings
- **Framework Preset**: Vite (should auto-detect)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `dist` (should auto-detect)
- **Install Command**: `npm install` (should auto-detect)

### 3. Environment Variables
Add these environment variables in Vercel dashboard:

```
VITE_SUPABASE_URL=https://gpjmttgqolnblfiiikra.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuaXhzd3R4dnVxdHl0bmVxZ29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MjUyNDMsImV4cCI6MjA1NzMwMTI0M30.-qsxItJdRegH2_wQogU7sntv_tXhi1S1tjK6fkmYHyk
```

### 4. Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at the provided Vercel URL

## Features Included
- ✅ Landing page with hero section
- ✅ Feature cards (payments, documents, tasks, loans)
- ✅ Pricing tiers (Free, Plus, Pro)
- ✅ Dashboard with project management
- ✅ Task board with drag & drop
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS

## Routes Available
- `/` - Landing page
- `/dashboard` - Dashboard view

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Ensure Node.js version is compatible (18.x or higher)

### Routing Issues
- The `vercel.json` file handles SPA routing
- All routes redirect to `index.html` for client-side routing

### Environment Variables Not Working
- Make sure they start with `VITE_` prefix
- Check they're added in Vercel dashboard under Project Settings > Environment Variables

## Post-Deployment
1. Test all routes work correctly
2. Verify Supabase connection is working
3. Check responsive design on different devices
4. Test all interactive features

## Custom Domain (Optional)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
