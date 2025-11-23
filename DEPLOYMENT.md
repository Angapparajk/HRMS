# Deploying Evallo HRMS Backend to Render

This guide will walk you through deploying the Evallo HRMS backend to Render with a PostgreSQL database.

## Prerequisites

- GitHub account (to connect your repository to Render)
- Render account (sign up at https://render.com - it's free)
- Your code pushed to a GitHub repository

## Step-by-Step Deployment Guide

### Step 1: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
```

2. **Create a new repository on GitHub** and push your code:
```bash
git remote add origin https://github.com/yourusername/evallo-backend.git
git branch -M main
git push -u origin main
```

### Step 2: Sign Up for Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up using your GitHub account (recommended)

### Step 3: Create a PostgreSQL Database

1. **From Render Dashboard**, click "New +" button
2. Select **"PostgreSQL"**
3. Configure your database:
   - **Name**: `evallo-hrms-db` (or any name you prefer)
   - **Database**: `evallo_hrms` (auto-generated, you can keep it)
   - **User**: `evallo_user` (auto-generated, you can keep it)
   - **Region**: Choose closest to your users (e.g., Oregon, Frankfurt, Singapore)
   - **Plan**: Select **"Free"** (includes 90 days free, then $7/month)
   - **PostgreSQL Version**: 16 (or latest)

4. Click **"Create Database"**

5. **Wait for database to be ready** (1-2 minutes)

6. **Copy Database Connection Details**:
   - Once ready, you'll see **"Internal Database URL"** and **"External Database URL"**
   - Click on the database name to see details
   - Copy the **Internal Database URL** (it looks like: `postgresql://user:password@hostname/database`)
   - **Keep this safe** - you'll need it for the backend service

### Step 4: Create Web Service for Backend

1. From Render Dashboard, click **"New +"** button
2. Select **"Web Service"**

3. **Connect Repository**:
   - Click "Connect account" if not already connected
   - Select your GitHub repository containing the backend code
   - Click "Connect"

4. **Configure Web Service**:

   **Basic Settings:**
   - **Name**: `evallo-hrms-backend` (this will be part of your URL)
   - **Region**: Same as your database (important for performance)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` (if backend is in a subdirectory, leave empty if it's the root)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

   **Instance Type:**
   - Select **"Free"** (includes 750 hours/month free)
   - Note: Free tier spins down after 15 minutes of inactivity

5. Click **"Advanced"** to add environment variables

### Step 5: Configure Environment Variables

Click **"Add Environment Variable"** for each of the following:

| Key | Value | Description |
|-----|-------|-------------|
| `PORT` | `5000` | Server port (Render will override with their port) |
| `NODE_ENV` | `production` | Environment mode |
| `DATABASE_URL` | *Paste Internal Database URL from Step 3* | PostgreSQL connection string |
| `DB_HOST` | *Extract from DATABASE_URL* | Database host |
| `DB_PORT` | `5432` | Database port |
| `DB_NAME` | `evallo_hrms` | Database name |
| `DB_USER` | *Extract from DATABASE_URL* | Database user |
| `DB_PASSWORD` | *Extract from DATABASE_URL* | Database password |
| `JWT_SECRET` | *Generate a strong secret* | JWT signing key (use random string generator) |
| `JWT_EXPIRES_IN` | `7d` | Token expiration time |
| `CORS_ORIGIN` | `http://localhost:3006` | Frontend URL (update after deploying frontend) |

**How to extract DATABASE_URL components:**

If your Internal Database URL is:
```
postgresql://evallo_user:AbCd1234XyZ@dpg-abcd1234xyz-a.oregon-postgres.render.com/evallo_hrms
```

Extract:
- `DB_USER` = `evallo_user`
- `DB_PASSWORD` = `AbCd1234XyZ`
- `DB_HOST` = `dpg-abcd1234xyz-a.oregon-postgres.render.com`
- `DB_NAME` = `evallo_hrms`

**Generate JWT_SECRET:**
```bash
# Use this command to generate a secure random string:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

6. Click **"Create Web Service"**

### Step 6: Wait for Deployment

1. Render will now:
   - Clone your repository
   - Run `npm install`
   - Start your application with `npm start`

2. **Monitor the deployment** in the "Logs" tab
   - You should see "✅ Database connection established successfully"
   - You should see "🚀 Server is running on port XXXX"

3. **Deployment takes 2-5 minutes** on first deploy

### Step 7: Test Your Backend

1. Once deployed, you'll get a URL like: `https://evallo-hrms-backend.onrender.com`

2. **Test the health endpoint**:
```bash
curl https://evallo-hrms-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Evallo HRMS API is running"
}
```

3. **Test registration** (create first organization):
```bash
curl -X POST https://evallo-hrms-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "organisationName": "My Company",
    "adminName": "Admin User",
    "adminEmail": "admin@mycompany.com",
    "password": "SecurePassword123"
  }'
```

### Step 8: Update CORS for Frontend

Once you deploy your frontend, update the `CORS_ORIGIN` environment variable:

1. Go to your backend service in Render Dashboard
2. Click "Environment"
3. Edit `CORS_ORIGIN` and add your frontend URL:
```
https://your-frontend.vercel.app,https://evallo-frontend.onrender.com
```
4. Save changes (this will trigger a redeploy)

### Step 9: Connect Backend to Frontend

Update your frontend `.env` file:

```env
VITE_API_BASE_URL=https://evallo-hrms-backend.onrender.com/api
```

Redeploy your frontend and test!

---

## Important Notes

### Free Tier Limitations

**Render Free Tier includes:**
- ✅ 750 hours/month free for web services
- ✅ 90 days free for PostgreSQL (then $7/month)
- ⚠️ **Web service spins down after 15 minutes of inactivity**
- ⚠️ **Cold start takes 30-60 seconds when inactive**

**Solutions for spin-down:**
1. Upgrade to paid tier ($7/month) for always-on
2. Use a cron job to ping your service every 14 minutes
3. Accept the cold-start delay (free option)

### Database Backups

**Free PostgreSQL includes:**
- Daily automated backups (kept for 7 days)
- Point-in-time recovery
- Access via psql or any PostgreSQL client

**To backup manually:**
```bash
# Install PostgreSQL tools locally, then:
pg_dump -h your-db-host -U evallo_user -d evallo_hrms > backup.sql
```

### Monitoring and Logs

1. **View Logs**: Dashboard → Your Service → Logs tab
2. **Metrics**: Dashboard → Your Service → Metrics tab (shows CPU, Memory, Network)
3. **Alerts**: Set up email alerts for deploy failures

### Updating Your Backend

**Option 1: Auto-deploy (Recommended)**
- Any push to your GitHub `main` branch will auto-deploy
- Enable in: Service Settings → Build & Deploy → Auto-Deploy: ON

**Option 2: Manual deploy**
- Dashboard → Your Service → Manual Deploy → Deploy latest commit

### Connecting to Database Directly

**Using psql:**
```bash
psql postgresql://evallo_user:password@host/evallo_hrms
```

**Using GUI tools (e.g., pgAdmin, DBeaver):**
- Use the **External Database URL** from Render
- Host: Extract from URL
- Port: 5432
- Database: evallo_hrms
- Username: Extract from URL
- Password: Extract from URL

---

## Troubleshooting

### Issue: "Database connection failed"

**Solution:**
1. Check environment variables are correct
2. Verify database is running (Green status in Render)
3. Use **Internal Database URL** not External
4. Check Render logs for specific error

### Issue: "Module not found" errors

**Solution:**
1. Ensure all dependencies are in `package.json`
2. Check Build Command is `npm install`
3. Verify Node version compatibility

### Issue: CORS errors from frontend

**Solution:**
1. Add frontend URL to `CORS_ORIGIN` environment variable
2. Format: `https://your-frontend.com` (no trailing slash)
3. Multiple URLs: separate with commas

### Issue: 502 Bad Gateway

**Solution:**
1. Check if service is running in Render Dashboard
2. View logs for crash errors
3. Ensure PORT is not hardcoded (Render assigns dynamic port)

### Issue: Free tier spinning down

**Solution:**
1. Accept delay (free option)
2. Upgrade to paid tier
3. Use cron-job.org to ping `/api/health` every 14 minutes

---

## Security Best Practices

1. ✅ **Never commit `.env` files** - Add to `.gitignore`
2. ✅ **Use strong JWT_SECRET** - Generate random 64+ character string
3. ✅ **Use environment variables** - Never hardcode credentials
4. ✅ **Enable SSL** - Render provides free SSL certificates
5. ✅ **Restrict CORS** - Only allow your frontend URLs
6. ✅ **Regular backups** - Download database backups weekly

---

## Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Web Service | 750 hrs/month (free) | $7/month (always-on) |
| PostgreSQL | 90 days free | $7/month (1GB storage) |
| **Total** | **Free for 90 days** | **$14/month after** |

---

## Next Steps

1. ✅ Deploy backend to Render (this guide)
2. Deploy frontend (Vercel/Netlify/Render)
3. Update CORS_ORIGIN with frontend URL
4. Test complete application
5. Set up custom domain (optional)
6. Configure monitoring and alerts

---

## Support

If you encounter issues:
1. Check Render documentation: https://render.com/docs
2. Check deployment logs in Render Dashboard
3. Render community forum: https://community.render.com
4. Contact Render support (paid plans include priority support)

**Good luck with your deployment! 🚀**
