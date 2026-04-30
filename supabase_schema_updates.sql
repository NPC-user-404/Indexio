-- Updates for folders
ALTER TABLE public.folders ADD COLUMN is_system BOOLEAN DEFAULT false;
ALTER TABLE public.folders ADD COLUMN deleted_at TIMESTAMP NULL;

-- Updates for links
ALTER TABLE public.links ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE public.links ADD CONSTRAINT links_user_id_url_key UNIQUE (user_id, url);

-- New table: shares
CREATE TABLE public.shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id uuid NULL,
  is_full_workspace boolean DEFAULT false,
  share_id text UNIQUE,
  created_at timestamp DEFAULT now()
);

-- Note: In a real environment, you'll need RLS policies for shares, e.g.:
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their shares" ON public.shares USING (auth.uid() = user_id);
CREATE POLICY "Public can view shares" ON public.shares FOR SELECT USING (true);
