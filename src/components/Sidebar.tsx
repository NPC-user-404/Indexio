import { Folder } from '@/types';
import { Bookmark, Folder as FolderIcon, LayoutGrid, Pin, Plus, Hash, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  folders: Folder[];
  currentFilter: string | null;
  onSelectFilter: (filter: string | null) => void;
  onCreateFolder: (name: string) => Promise<void>;
  onDeleteFolder: (id: string, name: string) => void;
  onExport: (folderId: string | null) => void;
  onShare: (folderId: string | null) => void;
}

export function Sidebar({ folders, currentFilter, onSelectFilter, onCreateFolder, onDeleteFolder, onExport, onShare }: SidebarProps) {
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleAddFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await onCreateFolder(newFolderName.trim());
    setNewFolderName('');
    setIsAddingFolder(false);
  };

  return (
    <aside className="w-64 bg-theme-box/50 border-r border-theme-border min-h-[calc(100vh-73px)] p-6 hidden md:block">
      <div className="space-y-1 mb-8">
        <button
          onClick={() => onSelectFilter(null)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentFilter === null ? 'bg-theme-bg text-theme-text' : 'text-theme-text/80 hover:bg-theme-bg/50 hover:text-theme-text'}`}
        >
          <LayoutGrid className="w-4 h-4" />
          All Links
        </button>
        <button
          onClick={() => onSelectFilter('pinned')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentFilter === 'pinned' ? 'bg-theme-bg text-theme-text' : 'text-theme-text/80 hover:bg-theme-bg/50 hover:text-theme-text'}`}
        >
          <Pin className="w-4 h-4" />
          Pinned
        </button>
        <button
          onClick={() => onSelectFilter('trash')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentFilter === 'trash' ? 'bg-theme-bg text-red-500' : 'text-theme-text/80 hover:bg-red-50 hover:text-red-500'}`}
        >
          <Trash2 className="w-4 h-4" />
          Trash
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 px-3">
          <h3 className="text-xs font-bold text-theme-text/60 uppercase tracking-wider">Workspace Actions</h3>
        </div>
        <div className="space-y-1">
          <button onClick={() => onExport(null)} className="w-full text-left px-3 py-2 text-sm text-theme-text/80 hover:bg-theme-bg/50 rounded-xl transition-colors">
            Export Workspace
          </button>
          <button onClick={() => onShare(null)} className="w-full text-left px-3 py-2 text-sm text-theme-text/80 hover:bg-theme-bg/50 rounded-xl transition-colors">
            Share Workspace
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 px-3">
          <h3 className="text-xs font-bold text-theme-text/60 uppercase tracking-wider">Folders</h3>
          <button 
            onClick={() => setIsAddingFolder(true)}
            className="text-theme-text/60 hover:text-theme-text transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-1">
          {folders.filter(f => !f.is_system).map(folder => (
            <div key={folder.id} className="group relative">
              <button
                onClick={() => onSelectFilter(folder.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentFilter === folder.id ? 'bg-theme-bg text-theme-text' : 'text-theme-text/80 hover:bg-theme-bg/50 hover:text-theme-text'}`}
              >
                <Hash className="w-4 h-4 opacity-50" />
                <span className="truncate pr-16">{folder.name}</span>
              </button>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => onExport(folder.id)}
                  className="p-1.5 text-theme-text/60 hover:text-theme-text hover:bg-theme-bg rounded-lg"
                  title="Export Folder"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onShare(folder.id)}
                  className="p-1.5 text-theme-text/60 hover:text-theme-text hover:bg-theme-bg rounded-lg"
                  title="Share Folder"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteFolder(folder.id, folder.name)}
                  className="p-1.5 text-theme-text/60 hover:text-red-500 hover:bg-theme-bg rounded-lg"
                  title="Delete Folder"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {folders.some(f => f.is_system) && (
          <div className="mt-6">
            <h3 className="text-xs font-bold text-theme-text/60 uppercase tracking-wider mb-2 px-3">System Folders</h3>
            <div className="space-y-1">
              {folders.filter(f => f.is_system).map(folder => (
                <button
                  key={folder.id}
                  onClick={() => onSelectFilter(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentFilter === folder.id ? 'bg-theme-bg text-theme-text' : 'text-theme-text/80 hover:bg-theme-bg/50 hover:text-theme-text'}`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <FolderIcon className="w-4 h-4 opacity-50" />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <span onClick={(e) => { e.stopPropagation(); onExport(folder.id); }} className="p-1 text-theme-text/40 hover:text-theme-text" title="Export"><Bookmark className="w-3 h-3"/></span>
                    <span onClick={(e) => { e.stopPropagation(); onShare(folder.id); }} className="p-1 text-theme-text/40 hover:text-theme-text" title="Share"><LayoutGrid className="w-3 h-3"/></span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {isAddingFolder && (
          <form onSubmit={handleAddFolder} className="mt-2 px-3">
            <input
              type="text"
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={() => setIsAddingFolder(false)}
              className="w-full px-3 py-2 rounded-lg border border-theme-border bg-theme-box text-theme-text text-sm focus:outline-none focus:ring-2 focus:ring-theme-border"
              placeholder="Folder name..."
            />
          </form>
        )}
      </div>
    </aside>
  );
}
