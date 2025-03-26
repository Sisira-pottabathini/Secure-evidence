
import React from 'react';
import { File, Lock, Eye } from 'lucide-react';
import GlassMorphicCard from './GlassMorphicCard';
import Button from './Button';
import { cn } from '@/lib/utils';

interface EvidenceCardProps {
  title: string;
  date: string;
  type: string;
  status: 'locked' | 'unlocked';
  canEdit: boolean;
  onView: () => void;
  onEdit?: () => void;
  className?: string;
}

const EvidenceCard: React.FC<EvidenceCardProps> = ({
  title,
  date,
  type,
  status,
  canEdit,
  onView,
  onEdit,
  className,
}) => {
  return (
    <GlassMorphicCard 
      className={cn(
        'animate-fade-in',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <File className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-4">
            <span>Added: {date}</span>
            <span className="font-medium text-foreground/80">{type}</span>
            <span className="flex items-center gap-1">
              {status === 'locked' ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary font-medium">Secured</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600 font-medium">Viewable</span>
                </>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
          {canEdit && onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
        </div>
      </div>
    </GlassMorphicCard>
  );
};

export default EvidenceCard;
