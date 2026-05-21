'use client';

import { useEffect, useState } from 'react';
import { Folder, LinkItem } from '@/types';
import { loadLinks, saveLinks, loadFolders, saveFolders } from '@/lib/storage';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { LinkCard } from '@/components/LinkCard';
import { AddLinkModal } from '@/components/AddLinkModal';
import { LayoutGrid, Plus } from 'lucide-react';

export default function Dashboard() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [mounted, setMounted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<{ id: string; name: string } | null>(null);

  // null = All Links, 'pinned' = Pinned, 'trash' = Trash, id = specific folder
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({ title: false, link: false, folder: false });

  // Load from localStorage once mounted
  useEffect(() => {
    setLinks(loadLinks());
    setFolders(loadFolders());
    setMounted(true);
  }, []);

  // Persist links whenever they change (after mount)
  useEffect(() => {
    if (mounted) saveLinks(links);
  }, [links, mounted]);

  // Persist folders whenever they change (after mount)
  useEffect(() => {
    if (mounted) saveFolders(folders);
  }, [folders, mounted]);

  const handleCreateFolder = async (name: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      created_at: new Date().toISOString(),
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return;
    const { id } = folderToDelete;
    setFolders(prev => prev.filter(f => f.id !== id));
    if (currentFilter === id) setCurrentFilter(null);
    setLinks(prev => prev.map(l => l.folder_id === id ? { ...l, folder_id: null } : l));
    setFolderToDelete(null);
  };

  const handleSaveLink = async (linkData: any, id?: string) => {
    // Duplicate detection
    if (!id) {
      const isDuplicate = links.some(l => l.url === linkData.url && !l.deleted_at);
      if (isDuplicate) {
        alert('Link already exists in your workspace.');
        return;
      }
    }

    let finalFolderId = linkData.folder_id;

    // Smart Context: auto-folder by domain
    if (!id && linkData.useSmartContext) {
      try {
        const urlObj = new URL(linkData.url);
        const domainParts = urlObj.hostname.replace('www.', '').split('.');
        if (domainParts.length > 0) {
          const domain = domainParts[0];
          const folderName = domain.charAt(0).toUpperCase() + domain.slice(1);

          let systemFolder = folders.find(
            f => f.name.toLowerCase() === folderName.toLowerCase() && f.is_system
          );

          if (!systemFolder) {
            systemFolder = {
              id: crypto.randomUUID(),
              name: folderName,
              is_system: true,
              created_at: new Date().toISOString(),
            };
            setFolders(prev => [...prev, systemFolder!]);
          }
          finalFolderId = systemFolder.id;
        }
      } catch {
        // invalid URL, skip smart context
      }
    }

    const dataToSave = {
      title: linkData.title,
      url: linkData.url,
      description: linkData.description || null,
      folder_id: finalFolderId || null,
    };

    if (id) {
      setLinks(prev => prev.map(l => l.id === id ? { ...l, ...dataToSave } : l));
    } else {
      const title = dataToSave.title || dataToSave.url;
      const newLink: LinkItem = {
        id: crypto.randomUUID(),
        ...dataToSave,
        title,
        is_pinned: false,
        created_at: new Date().toISOString(),
        deleted_at: null,
      };
      setLinks(prev => [newLink, ...prev]);
    }
  };

  const handleTogglePin = async (id: string, currentStatus: boolean) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, is_pinned: !currentStatus } : l));
  };

  const handleRestoreLink = async (id: string) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, deleted_at: null } : l));
  };

  const handleDelete = async (id: string) => {
    const link = links.find(l => l.id === id);
    if (!link) return;

    if (link.deleted_at) {
      // Permanent delete
      setLinks(prev => prev.filter(l => l.id !== id));
    } else {
      // Soft delete
      const deletedAt = new Date().toISOString();
      setLinks(prev => prev.map(l => l.id === id ? { ...l, deleted_at: deletedAt } : l));
    }
  };

  const handleExport = (folderId: string | null) => {
    let toExport = links.filter(l => !l.deleted_at);
    if (folderId) {
      toExport = toExport.filter(l => l.folder_id === folderId);
    }

    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.setFontSize(12);
      let y = 20;

      toExport.forEach(link => {
        const titleLine = link.description ? `${link.title}: ${link.description}` : link.title;
        const urlLine = link.url;

        const splitTitle = doc.splitTextToSize(titleLine, 170);
        const splitUrl = doc.splitTextToSize(urlLine, 170);

        const titleHeight = splitTitle.length * 6;
        const urlHeight = splitUrl.length * 6;
        const totalHeight = titleHeight + urlHeight + 10;

        if (y + totalHeight > 280) {
          doc.addPage();
          y = 20;
        }

        doc.text(splitTitle, 20, y);
        y += titleHeight;

        doc.text(splitUrl, 20, y);
        y += urlHeight + 10;
      });

      doc.save(folderId ? `export_folder_${folderId}.pdf` : 'export_workspace.pdf');
    });
  };

  const handleShare = (folderId: string | null) => {
    const url = window.location.origin + '/dashboard';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('App link copied to clipboard! Note: data is local to this device.');
      });
    } else {
      prompt('Copy this link to share:', url);
    }
  };

  // Filtering
  let filteredLinks = links;
  if (currentFilter === 'trash') {
    filteredLinks = filteredLinks.filter(l => l.deleted_at);
  } else {
    filteredLinks = filteredLinks.filter(l => !l.deleted_at);
    if (currentFilter !== null) {
      if (currentFilter === 'pinned') filteredLinks = filteredLinks.filter(l => l.is_pinned);
      else filteredLinks = filteredLinks.filter(l => l.folder_id === currentFilter);
    }
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredLinks = filteredLinks.filter(link => {
      const matchTitle = link.title.toLowerCase().includes(q);
      const matchLink = link.url.toLowerCase().includes(q);
      const folder = folders.find(f => f.id === link.folder_id);
      const matchFolder = folder ? folder.name.toLowerCase().includes(q) : false;

      if (!searchFilters.title && !searchFilters.link && !searchFilters.folder) {
        return matchTitle || matchLink || matchFolder;
      }

      let match = true;
      if (searchFilters.title) match = match && matchTitle;
      if (searchFilters.link) match = match && matchLink;
      if (searchFilters.folder) match = match && matchFolder;
      return match;
    });
  }

  const getFilterTitle = () => {
    if (currentFilter === 'trash') return 'Trash';
    if (currentFilter === null) return 'All Links';
    if (currentFilter === 'pinned') return 'Pinned Links';
    const folder = folders.find(f => f.id === currentFilter);
    return folder ? folder.name : 'Links';
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-bg">
        <div className="w-8 h-8 border-4 border-theme-border border-t-theme-text rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col">
      <Navbar
        onAddClick={() => { setEditingLink(null); setIsModalOpen(true); }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchFilters={searchFilters}
        onFilterChange={setSearchFilters}
      />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar
          folders={folders}
          currentFilter={currentFilter}
          onSelectFilter={setCurrentFilter}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={(id, name) => setFolderToDelete({ id, name })}
          onExport={handleExport}
          onShare={handleShare}
        />

        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-theme-text flex items-center gap-2">
              <LayoutGrid className="w-6 h-6 text-theme-text" />
              {getFilterTitle()}
            </h1>
            <p className="text-theme-text/80 mt-1">
              {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'} saved
            </p>
          </div>

          {filteredLinks.length === 0 ? (
            <div className="text-center py-20 bg-theme-box rounded-3xl border border-dashed border-theme-border">
              <div className="w-16 h-16 bg-theme-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LayoutGrid className="w-8 h-8 text-theme-text/60" />
              </div>
              <h3 className="text-lg font-bold text-theme-text mb-1">No links found</h3>
              <p className="text-theme-text/80 mb-6 max-w-sm mx-auto">
                You haven&apos;t added any links here yet. Start building your collection!
              </p>
              <button
                onClick={() => { setEditingLink(null); setIsModalOpen(true); }}
                className="bg-theme-text hover:opacity-90 text-theme-bg px-6 py-3 rounded-full font-medium transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Link
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {currentFilter === null && filteredLinks.some(l => l.is_pinned) && (
                <div>
                  <h2 className="text-sm font-bold text-theme-text/60 uppercase tracking-wider mb-4 px-1">Pinned</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLinks.filter(l => l.is_pinned).map(link => (
                      <LinkCard
                        key={link.id}
                        link={link}
                        onTogglePin={handleTogglePin}
                        onDelete={handleDelete}
                        onEdit={(link) => { setEditingLink(link); setIsModalOpen(true); }}
                        onRestore={handleRestoreLink}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                {currentFilter === null && filteredLinks.some(l => l.is_pinned) && filteredLinks.some(l => !l.is_pinned) && (
                  <h2 className="text-sm font-bold text-theme-text/60 uppercase tracking-wider mb-4 px-1">All Other Links</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLinks.filter(l => currentFilter !== null || !l.is_pinned).map(link => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onTogglePin={handleTogglePin}
                      onDelete={handleDelete}
                      onEdit={(link) => { setEditingLink(link); setIsModalOpen(true); }}
                      onRestore={handleRestoreLink}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <AddLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLink}
        folders={folders}
        editingLink={editingLink}
      />

      {folderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-theme-box rounded-3xl w-full max-w-sm shadow-2xl p-6 border border-theme-border">
            <h3 className="text-xl font-bold text-theme-text mb-2">Delete Folder?</h3>
            <p className="text-theme-text/80 mb-6">
              Are you sure you want to delete <strong>{folderToDelete.name}</strong>? Links inside will not be deleted, but will be moved to &ldquo;All Links&rdquo;.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setFolderToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-theme-text bg-theme-bg hover:bg-theme-bg/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFolder}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
