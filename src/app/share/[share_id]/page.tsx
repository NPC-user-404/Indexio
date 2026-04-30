'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Folder, LinkItem, Share } from '@/types';
import { LinkCard } from '@/components/LinkCard';
import { Loader2, LayoutGrid, AlertCircle } from 'lucide-react';

export default function SharePage({ params }: { params: { share_id: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [shareInfo, setShareInfo] = useState<Share | null>(null);

  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        // Fetch share record
        const { data: shareData, error: shareError } = await supabase
          .from('shares')
          .select('*')
          .eq('share_id', params.share_id)
          .single();
          
        if (shareError || !shareData) {
          throw new Error('Share link not found or has expired.');
        }
        setShareInfo(shareData);

        // Fetch folders (for display names)
        const { data: foldersData } = await supabase
          .from('folders')
          .select('*')
          .eq('user_id', shareData.user_id);
          
        if (foldersData) setFolders(foldersData);

        // Fetch links
        let linksQuery = supabase
          .from('links')
          .select('*')
          .eq('user_id', shareData.user_id)
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (!shareData.is_full_workspace && shareData.folder_id) {
          linksQuery = linksQuery.eq('folder_id', shareData.folder_id);
        }

        const { data: linksData, error: linksError } = await linksQuery;
        if (linksError) throw linksError;
        if (linksData) setLinks(linksData);

      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedData();
  }, [params.share_id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-theme-bg"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-bg">
        <div className="bg-theme-box p-8 rounded-3xl border border-red-500/30 flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-theme-text mb-2">Error</h2>
          <p className="text-theme-text/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col">
      <nav className="bg-theme-box border-b border-theme-border sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-[73px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-theme-text" />
            <span className="text-xl font-bold text-theme-text hidden sm:block">
              {shareInfo?.is_full_workspace ? 'Shared Workspace' : 'Shared Folder'}
            </span>
          </div>
          <div className="text-sm font-medium text-theme-text/60">
            Read Only
          </div>
        </div>
      </nav>
      
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-theme-text flex items-center gap-2">
            {shareInfo?.is_full_workspace 
              ? 'All Shared Links' 
              : folders.find(f => f.id === shareInfo?.folder_id)?.name || 'Shared Folder'}
          </h1>
          <p className="text-theme-text/80 mt-1">
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </p>
        </div>

        {links.length === 0 ? (
          <div className="text-center py-20 bg-theme-box rounded-3xl border border-dashed border-theme-border">
            <h3 className="text-lg font-bold text-theme-text mb-1">No links found</h3>
            <p className="text-theme-text/80">This shared view is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map(link => (
              <LinkCard 
                key={link.id} 
                link={link} 
                isReadOnly={true}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
