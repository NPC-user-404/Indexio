'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Folder, LinkItem } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { LinkCard } from '@/components/LinkCard';
import { AddLinkModal } from '@/components/AddLinkModal';
import { Loader2, LayoutGrid, Plus } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  
  const [folderToDelete, setFolderToDelete] = useState<{id: string, name: string} | null>(null);

  // null = All Links, 'pinned' = Pinned Links, 'trash' = Trash, id = specific folder
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({ title: false, link: false, folder: false });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setUser(session.user);
        fetchData(session.user.id);
      }
    };
    checkAuth();
  }, [router]);

  const fetchData = async (userId: string) => {
    try {
      const [linksRes, foldersRes] = await Promise.all([
        supabase.from('links').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('folders').select('*').eq('user_id', userId).order('created_at', { ascending: true })
      ]);
      
      if (linksRes.data) setLinks(linksRes.data);
      if (foldersRes.data) setFolders(foldersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (name: string) => {
    if (!user) return;
    try {
      const tempId = crypto.randomUUID();
      const newFolder = { id: tempId, user_id: user.id, name, created_at: new Date().toISOString() };
      setFolders([...folders, newFolder]); // optimistic

      const { data, error } = await supabase
        .from('folders')
        .insert([{ user_id: user.id, name }])
        .select()
        .single();
        
      if (error) throw error;
      setFolders(prev => prev.map(f => f.id === tempId ? data : f));
    } catch (error) {
      console.error('Error creating folder:', error);
      fetchData(user.id); // revert on error
    }
  };

  const handleDeleteFolder = async () => {
    if (!user || !folderToDelete) return;
    const { id } = folderToDelete;
    
    // optimistic update
    setFolders(prev => prev.filter(f => f.id !== id));
    if (currentFilter === id) setCurrentFilter(null);
    setLinks(prev => prev.map(l => l.folder_id === id ? { ...l, folder_id: null } : l));
    setFolderToDelete(null);

    try {
      const { error } = await supabase.from('folders').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting folder:', error);
      fetchData(user.id); // revert
    }
  };

  const handleSaveLink = async (linkData: any, id?: string) => {
    if (!user) return;
    
    try {
      // Duplicate link detection
      if (!id) {
        const isDuplicate = links.some(l => l.url === linkData.url && !l.deleted_at);
        if (isDuplicate) {
          alert("Link already exists in your workspace.");
          return;
        }
      }

      let finalFolderId = linkData.folder_id;
      
      // Smart Context logic
      if (!id && linkData.useSmartContext) {
        try {
          const urlObj = new URL(linkData.url);
          const domainParts = urlObj.hostname.replace('www.', '').split('.');
          if (domainParts.length > 0) {
            const domain = domainParts[0];
            const folderName = domain.charAt(0).toUpperCase() + domain.slice(1);
            
            // Check if system folder exists
            let systemFolder = folders.find(f => f.name.toLowerCase() === folderName.toLowerCase() && f.is_system);
            
            if (!systemFolder) {
              const tempId = crypto.randomUUID();
              const newFolder = { id: tempId, user_id: user.id, name: folderName, is_system: true, created_at: new Date().toISOString() };
              setFolders([...folders, newFolder]);
              
              const { data, error } = await supabase
                .from('folders')
                .insert([{ user_id: user.id, name: folderName, is_system: true }])
                .select()
                .single();
                
              if (!error && data) {
                systemFolder = data;
                setFolders(prev => prev.map(f => f.id === tempId ? data : f));
              }
            }
            if (systemFolder) {
              finalFolderId = systemFolder.id;
            }
          }
        } catch (e) {
          // invalid url, ignore smart context
        }
      }
      
      const dataToSave = {
        title: linkData.title,
        url: linkData.url,
        description: linkData.description,
        folder_id: finalFolderId
      };

      if (id) {
        // Update
        setLinks(prev => prev.map(l => l.id === id ? { ...l, ...dataToSave } : l)); // optimistic
        const { error } = await supabase
          .from('links')
          .update(dataToSave)
          .eq('id', id);
        if (error) throw error;
      } else {
        // Insert
        const title = dataToSave.title || dataToSave.url; // Fallback
        const tempId = crypto.randomUUID();
        const newLink = { 
          id: tempId, 
          user_id: user.id, 
          ...dataToSave, 
          title,
          is_pinned: false, 
          created_at: new Date().toISOString() 
        };
        setLinks([newLink, ...links]); // optimistic

        const { data, error } = await supabase
          .from('links')
          .insert([{ user_id: user.id, ...dataToSave, title }])
          .select()
          .single();
          
        if (error) throw error;
        setLinks(prev => prev.map(l => l.id === tempId ? data : l));
      }
    } catch (error) {
      console.error('Error saving link:', error);
      fetchData(user.id); // revert
    }
  };

  const handleTogglePin = async (id: string, currentStatus: boolean) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, is_pinned: !currentStatus } : l)); // optimistic
    try {
      const { error } = await supabase.from('links').update({ is_pinned: !currentStatus }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error toggling pin:', error);
      fetchData(user!.id); // revert
    }
  };

  const handleRestoreLink = async (id: string) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, deleted_at: null } : l));
    try {
      const { error } = await supabase.from('links').update({ deleted_at: null }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error restoring link:', error);
      fetchData(user!.id);
    }
  };

  const handleDelete = async (id: string) => {
    const link = links.find(l => l.id === id);
    if (!link) return;

    if (link.deleted_at) {
      // Permanent delete
      setLinks(prev => prev.filter(l => l.id !== id));
      try {
        const { error } = await supabase.from('links').delete().eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error permanently deleting link:', error);
        fetchData(user!.id);
      }
    } else {
      // Soft delete
      const deletedAt = new Date().toISOString();
      setLinks(prev => prev.map(l => l.id === id ? { ...l, deleted_at: deletedAt } : l));
      try {
        const { error } = await supabase.from('links').update({ deleted_at: deletedAt }).eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error soft deleting link:', error);
        fetchData(user!.id);
      }
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
      
      toExport.forEach((link) => {
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

  const handleShare = async (folderId: string | null) => {
    if (!user) return;
    try {
      const shareId = crypto.randomUUID();
      const { data, error } = await supabase.from('shares').insert({
        user_id: user.id,
        folder_id: folderId,
        is_full_workspace: !folderId,
        share_id: shareId
      }).select().single();
      
      if (error) throw error;
      const shareUrl = `${window.location.origin}/share/${shareId}`;
      prompt('Share link created! Copy the link below:', shareUrl);
    } catch (e) {
      console.error(e);
      alert('Failed to create share link');
    }
  };

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

      // No filters selected -> search all
      if (!searchFilters.title && !searchFilters.link && !searchFilters.folder) {
        return matchTitle || matchLink || matchFolder;
      }

      // AND logic
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

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col">
      <Navbar 
        onAddClick={() => { setEditingLink(null); setIsModalOpen(true); }} 
        userEmail={user?.email}
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
                You haven't added any links here yet. Start building your collection!
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
              Are you sure you want to delete <strong>{folderToDelete.name}</strong>? Links inside will not be deleted, but will be moved to "All Links".
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
