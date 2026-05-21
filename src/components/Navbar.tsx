'use client';

import { Bookmark, Plus } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onAddClick: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  searchFilters?: { title: boolean; link: boolean; folder: boolean };
  onFilterChange?: (filters: { title: boolean; link: boolean; folder: boolean }) => void;
}

export function Navbar({ onAddClick, searchQuery, onSearchChange, searchFilters, onFilterChange }: NavbarProps) {
  const toggleFilter = (key: 'title' | 'link' | 'folder') => {
    if (onFilterChange && searchFilters) {
      onFilterChange({ ...searchFilters, [key]: !searchFilters[key] });
    }
  };

  return (
    <nav className="bg-theme-box border-b border-theme-border sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-[73px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Bookmark className="w-6 h-6 text-theme-text" />
          <span className="text-xl font-bold text-theme-text hidden sm:block">Indexio</span>
        </Link>

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
              <label className="flex items-center gap-1 cursor-pointer text-theme-text/70">
                <input type="checkbox" checked={searchFilters.title} onChange={() => toggleFilter('title')} className="accent-theme-text" /> Title
              </label>
              <label className="flex items-center gap-1 cursor-pointer text-theme-text/70">
                <input type="checkbox" checked={searchFilters.link} onChange={() => toggleFilter('link')} className="accent-theme-text" /> Link
              </label>
              <label className="flex items-center gap-1 cursor-pointer text-theme-text/70">
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
        </div>
      </div>
    </nav>
  );
}
