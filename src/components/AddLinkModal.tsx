import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Folder, LinkItem } from '@/types';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; url: string; description?: string; folder_id?: string; useSmartContext?: boolean }, id?: string) => Promise<void>;
  folders: Folder[];
  editingLink?: LinkItem | null;
}

export function AddLinkModal({ isOpen, onClose, onSave, folders, editingLink }: AddLinkModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState<string>('none');
  const [useSmartContext, setUseSmartContext] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
      setDescription(editingLink.description || '');
      setFolderId(editingLink.folder_id || 'none');
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setFolderId('none');
    }
  }, [editingLink, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        title,
        url,
        description: description || undefined,
        folder_id: folderId === 'none' ? undefined : folderId,
        useSmartContext,
      }, editingLink?.id);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-theme-box rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-theme-border">
        <div className="flex items-center justify-between p-6 border-b border-theme-border">
          <h2 className="text-xl font-bold text-theme-text">
            {editingLink ? 'Edit Link' : 'Add New Link'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-theme-text/60 hover:text-theme-text hover:bg-theme-bg/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          <div>
            <label className="block text-sm font-medium text-theme-text mb-1.5">URL</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-theme-border bg-theme-bg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-text/20 focus:border-theme-text/50 transition-all placeholder:text-theme-text/40"
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-theme-text mb-1.5">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-theme-border bg-theme-bg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-text/20 focus:border-theme-text/50 transition-all placeholder:text-theme-text/40"
              placeholder="My Awesome Link"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-theme-text mb-1.5">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-theme-border bg-theme-bg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-text/20 focus:border-theme-text/50 transition-all resize-none h-24 placeholder:text-theme-text/40"
              placeholder="What is this link about?"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-theme-text mb-1.5">Folder</label>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-theme-border bg-theme-bg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-text/20 focus:border-theme-text/50 transition-all appearance-none"
            >
              <option value="none" className="text-theme-text bg-theme-bg">No Folder</option>
              <optgroup label="Your Folders" className="text-theme-text/60">
                {folders.filter(f => !f.is_system).map(f => (
                  <option key={f.id} value={f.id} className="text-theme-text bg-theme-bg">{f.name}</option>
                ))}
              </optgroup>
              {folders.some(f => f.is_system) && (
                <optgroup label="System Folders" className="text-theme-text/60">
                  {folders.filter(f => f.is_system).map(f => (
                    <option key={f.id} value={f.id} className="text-theme-text bg-theme-bg">{f.name}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="smartContext" 
              checked={useSmartContext} 
              onChange={(e) => setUseSmartContext(e.target.checked)}
              className="w-4 h-4 rounded border-theme-border text-theme-text focus:ring-theme-text/20"
            />
            <label htmlFor="smartContext" className="text-sm font-medium text-theme-text">Smart Context (Auto-folder based on URL)</label>
          </div>
          
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-theme-text bg-theme-bg hover:opacity-80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium text-theme-bg bg-theme-text hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
