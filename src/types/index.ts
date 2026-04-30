export type LinkItem = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description: string | null;
  is_pinned: boolean;
  folder_id: string | null;
  created_at: string;
  deleted_at?: string | null;
};

export type Folder = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  is_system?: boolean;
  deleted_at?: string | null;
};

export type Share = {
  id: string;
  user_id: string;
  folder_id: string | null;
  is_full_workspace: boolean;
  share_id: string;
  created_at: string;
};
