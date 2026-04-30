# Indexio -    Supabase Setup Guide

This guide will help you set up the Supabase project and database schema for Indexio.

## 1. Create a Supabase Project
1. Go to [database.new](https://database.new) and create a new project.
2. Once the project is ready, go to **Project Settings -> API** to get your URL and Anon Key.
3. Create a `.env.local` file in the root of your project:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 2. Setup Authentication
1. Go to **Authentication -> Providers**.
2. Make sure **Email** is enabled.
3. Disable "Confirm email" under **Authentication -> Providers -> Email** if you want seamless signups without verification.

## 3. Database Schema
Go to the **SQL Editor** in your Supabase dashboard and run the following SQL script to create the necessary tables and Row Level Security (RLS) policies:

```sql
-- Create folders table
CREATE TABLE public.folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create links table
CREATE TABLE public.links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    is_pinned BOOLEAN DEFAULT false,
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Create policies for folders
CREATE POLICY "Users can view their own folders" 
ON public.folders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own folders" 
ON public.folders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" 
ON public.folders FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" 
ON public.folders FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for links
CREATE POLICY "Users can view their own links" 
ON public.links FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own links" 
ON public.links FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links" 
ON public.links FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links" 
ON public.links FOR DELETE 
USING (auth.uid() = user_id);

-- Function to allow users to delete their own account
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM auth.users WHERE id = auth.uid();
$$;
```

## 4. Run the app
Start your local dev server:
```bash
npm run dev
```
