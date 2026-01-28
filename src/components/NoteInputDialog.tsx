import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Event } from '@/types';

interface NoteInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onConfirm: (eventId: string, note: string) => void;
}

export const NoteInputDialog = ({ 
  open, 
  onOpenChange, 
  event, 
  onConfirm 
}: NoteInputDialogProps) => {
  const [note, setNote] = useState('');

  // Reset note when dialog opens
  useEffect(() => {
    if (open) {
      setNote('');
    }
  }, [open]);

  const handleConfirm = () => {
    if (event) {
      onConfirm(event.id, note.trim());
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    setNote('');
    onOpenChange(false);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[340px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{event.icon}</span>
            <span>{event.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          <Textarea
            placeholder="记录一些内容... (可选)"
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 500))}
            className="min-h-[120px] resize-none rounded-xl border-muted focus-visible:ring-primary"
            autoFocus
          />
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {note.length}/500
          </p>
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 rounded-xl"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
          >
            <Pencil className="w-4 h-4 mr-1" />
            记录
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
