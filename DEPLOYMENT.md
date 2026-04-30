# Indexio - Deployment Guide

This guide provides a detailed, step-by-step process for deploying Indexio to Vercel and connecting it to a production Supabase database.

---

## 1. Supabase Database Setup

Before deploying the frontend, you need a live database to connect it to.

### Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and sign up or log in.
2. Click **New Project**, select your organization, and provide a name and database password.
3. Wait a few minutes for the database to provision.

### Run Database Schema
1. In your Supabase Dashboard, go to the **SQL Editor** (from the left sidebar).
2. Click **New query**.
3. Copy the contents of `SUPABASE_SETUP.md` (specifically the SQL block under Database Schema) and paste it into the editor. Run it.
4. After that, open the `supabase_schema_updates.sql` file located in the root of this project, copy its contents, and run it in the SQL Editor as well. This ensures all the latest features like Smart Context, Trash, and Share tables are created correctly.

### Obtain Connection Keys
1. In the Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Locate the **Project URL**. You will need this as your Supabase URL.
3. Locate the **Project API keys** and copy the `anon` `public` key.

### Connect the Frontend Locally (Optional but Recommended)
To test locally before deploying:
1. Create a `.env.local` file in the root of your project.
2. Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

---

## 2. Vercel Deployment

Once your database is ready, you can deploy the frontend application to Vercel.

### Push Project to GitHub
1. Open your terminal in the project directory.
2. Ensure you have initialized git and committed all files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Create a new empty repository on GitHub.
4. Link your local project to GitHub and push (replace `<your-repo-url>` with your actual URL):
   ```bash
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```

### Import Project into Vercel
1. Go to [Vercel](https://vercel.com/) and sign up or log in with your GitHub account.
2. Click **Add New** -> **Project**.
3. Locate your newly pushed GitHub repository in the list and click **Import**.

### Framework Detection & Build Settings
1. **Framework Preset:** Vercel will automatically detect the framework as **Next.js**. Leave this as default.
2. **Build Command:** Vercel will default to `next build`. Leave this.
3. **Output Directory:** Vercel will default to `.next`. Leave this.

### Configure Environment Variables
Before clicking Deploy, expand the **Environment Variables** section. Add the two keys you retrieved from Supabase:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | *Paste your Supabase Project URL here* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *Paste your Supabase Anon Public Key here* |

*Click **Add** after entering each key-value pair.*

### Deploy
1. Click the **Deploy** button.
2. Vercel will build the project. This usually takes 1-2 minutes.
3. Once finished, you will see a success screen with your live production URL.

---

## 3. Environment Variables Reference

Here is a clear definition of the required environment variables:

- **`NEXT_PUBLIC_SUPABASE_URL`**: The unique domain URL pointing to your Supabase project's REST API endpoint (e.g., `https://xxxxxxx.supabase.co`).
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: The public anonymous key for Supabase. It allows your frontend to safely communicate with the database, restricted by the Row Level Security (RLS) policies defined in your SQL setup.

*Note: Because these variables are prefixed with `NEXT_PUBLIC_`, they are safely exposed to the browser to allow the client-side Supabase SDK to function.*
