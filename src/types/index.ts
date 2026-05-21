export type LinkItem = {
  id: string;
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
  name: string;
  created_at: string;
  is_system?: boolean;
};
