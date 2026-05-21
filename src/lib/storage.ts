import { LinkItem, Folder } from '@/types';

const LINKS_KEY = 'indexio_links';
const FOLDERS_KEY = 'indexio_folders';

export function loadLinks(): LinkItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLinks(links: LinkItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

export function loadFolders(): Folder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FOLDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFolders(folders: Folder[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}
