import { LinkItem } from '@/types';
import { ExternalLink, RotateCcw, Pin, Trash2, Edit2 } from 'lucide-react';

interface LinkCardProps {
  link: LinkItem;
  onTogglePin?: (id: string, currentStatus: boolean) => void;
  onDelete?: (id: string) => void;
  onEdit?: (link: LinkItem) => void;
  onRestore?: (id: string) => void;
  isReadOnly?: boolean;
}

export function LinkCard({ link, onTogglePin, onDelete, onEdit, onRestore, isReadOnly }: LinkCardProps) {
  const domain = new URL(link.url).hostname.replace('www.', '');
  const isDeleted = !!link.deleted_at;

  return (
    <div className={`group bg-theme-box rounded-2xl p-5 shadow-sm border ${isDeleted ? 'border-red-500/30' : 'border-theme-border'} hover:shadow-md hover:border-theme-text/40 transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <a 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`flex-1 min-w-0 pr-4 ${isDeleted ? 'opacity-60' : ''}`}
        >
          <h3 className="font-semibold text-theme-text truncate hover:opacity-80 transition-opacity">
            {link.title}
          </h3>
          <p className="text-sm text-theme-text/70 mt-1 flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="truncate">{domain}</span>
          </p>
        </a>
        
        {!isReadOnly && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isDeleted ? (
              <>
                <button 
                  onClick={() => onTogglePin && onTogglePin(link.id, link.is_pinned)}
                  className={`p-2 rounded-lg transition-colors ${link.is_pinned ? 'text-amber-500 bg-theme-bg' : 'text-theme-text/50 hover:text-theme-text hover:bg-theme-bg'}`}
                  title={link.is_pinned ? "Unpin" : "Pin"}
                >
                  <Pin className={`w-4 h-4 ${link.is_pinned ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={() => onEdit && onEdit(link)}
                  className="p-2 text-theme-text/50 hover:text-theme-text hover:bg-theme-bg rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => onRestore && onRestore(link.id)}
                className="p-2 text-green-500 hover:text-green-600 hover:bg-theme-bg rounded-lg transition-colors"
                title="Restore"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => onDelete && onDelete(link.id)}
              className={`p-2 rounded-lg transition-colors ${isDeleted ? 'text-red-500 hover:bg-red-50' : 'text-theme-text/50 hover:text-red-500 hover:bg-theme-bg'}`}
              title={isDeleted ? "Permanent Delete" : "Delete"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      {link.description && (
        <p className={`text-sm text-theme-text/80 line-clamp-2 mt-2 leading-relaxed ${isDeleted ? 'opacity-60' : ''}`}>
          {link.description}
        </p>
      )}
    </div>
  );
}
