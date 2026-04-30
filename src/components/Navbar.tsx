'use client';

import { Bookmark, Plus, LogOut, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavbarProps {
  onAddClick: () => void;
  userEmail?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  searchFilters?: { title: boolean; link: boolean; folder: boolean };
  onFilterChange?: (filters: { title: boolean; link: boolean; folder: boolean }) => void;
}

export function Navbar({ onAddClick, userEmail, searchQuery, onSearchChange, searchFilters, onFilterChange }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const toggleFilter = (key: 'title' | 'link' | 'folder') => {
    if (onFilterChange && searchFilters) {
      onFilterChange({ ...searchFilters, [key]: !searchFilters[key] });
    }
  };

  return (
    <nav className="bg-theme-box border-b border-theme-border sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-[73px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-theme-text" />
          <span className="text-xl font-bold text-theme-text hidden sm:block">Indexio</span>
        </div>
        
        {onSearchChange && searchFilters && (
          <div className="flex-1 max-w-xl mx-4 flex flex-col items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-theme-bg text-theme-text border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-text/20 transition-all text-sm"
            />
            <div className="flex items-center gap-4 mt-2 text-xs">
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={searchFilters.title} onChange={() => toggleFilter('title')} className="accent-theme-text" /> Title
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={searchFilters.link} onChange={() => toggleFilter('link')} className="accent-theme-text" /> Link
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={searchFilters.folder} onChange={() => toggleFilter('folder')} className="accent-theme-text" /> Folder
              </label>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-theme-text hover:opacity-90 text-theme-bg px-4 py-2.5 rounded-full font-medium transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:block">Add Link</span>
          </button>
          
          <div className="h-8 w-px bg-theme-border mx-1"></div>
          
          <div className="flex items-center gap-3 group relative">
            <div className="w-10 h-10 rounded-full bg-theme-bg text-theme-text flex items-center justify-center font-bold text-sm">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-theme-box rounded-2xl shadow-xl border border-theme-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-3">
                <p className="text-xs text-theme-text/70 mb-2 px-2 truncate">{userEmail}</p>
                <Link
                  href="/profile"
                  className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-theme-text hover:bg-theme-bg rounded-lg transition-colors font-medium mb-1"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
