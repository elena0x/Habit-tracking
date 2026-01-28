import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Zap, Plus, Trash2 } from 'lucide-react';
import type { Event, EventRecord } from '@/types';
import { formatRelativeTime } from '@/lib/dateUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EventGridProps {
  events: Event[];
  getLastRecord: (eventId: string) => EventRecord | null;
  onQuickRecord: (eventId: string) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const colorClasses: { [key: string]: string } = {
  amber: 'bg-amber-50 border-amber-100',
  rose: 'bg-rose-50 border-rose-100',
  emerald: 'bg-emerald-50 border-emerald-100',
  sky: 'bg-sky-50 border-sky-100',
  violet: 'bg-violet-50 border-violet-100',
  orange: 'bg-orange-50 border-orange-100',
};

const iconBgClasses: { [key: string]: string } = {
  amber: 'bg-amber-100',
  rose: 'bg-rose-100',
  emerald: 'bg-emerald-100',
  sky: 'bg-sky-100',
  violet: 'bg-violet-100',
  orange: 'bg-orange-100',
};

const LONG_PRESS_DURATION = 500; // ms

export const EventGrid = ({ events, getLastRecord, onQuickRecord, onDeleteEvent }: EventGridProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const handleTouchStart = useCallback((event: Event) => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setEventToDelete(event);
      setDeleteDialogOpen(true);
      // Vibrate if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, LONG_PRESS_DURATION);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleClick = useCallback((eventId: string) => {
    // Only trigger quick record if it wasn't a long press
    if (!isLongPressRef.current) {
      onQuickRecord(eventId);
    }
    isLongPressRef.current = false;
  }, [onQuickRecord]);

  const handleConfirmDelete = useCallback(() => {
    if (eventToDelete && onDeleteEvent) {
      onDeleteEvent(eventToDelete.id);
    }
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  }, [eventToDelete, onDeleteEvent]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 animate-fade-in">
        {events.map(event => {
          const lastRecord = getLastRecord(event.id);
          const colorClass = colorClasses[event.color || 'sky'] || colorClasses.sky;
          const iconBgClass = iconBgClasses[event.color || 'sky'] || iconBgClasses.sky;
          
          return (
            <button
              key={event.id}
              onClick={() => handleClick(event.id)}
              onTouchStart={() => handleTouchStart(event)}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onMouseDown={() => handleTouchStart(event)}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              onContextMenu={(e) => {
                e.preventDefault();
                setEventToDelete(event);
                setDeleteDialogOpen(true);
              }}
              className={cn(
                'relative p-4 rounded-2xl border transition-all duration-200',
                'flex flex-col text-left min-h-[120px]',
                'active:scale-[0.98] hover:shadow-card select-none',
                colorClass
              )}
            >
              {/* Icon */}
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center mb-3',
                iconBgClass
              )}>
                <span className="text-xl">{event.icon}</span>
              </div>
              
              {/* Event Name */}
              <h3 className="font-medium text-foreground text-sm mb-1 truncate">
                {event.name}
              </h3>
              
              {/* Last Record */}
              <p className="text-xs text-muted-foreground">
                上次：{lastRecord ? formatRelativeTime(lastRecord.createdAt) : '–'}
              </p>
              
              {/* Quick Action Button */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-background/60 flex items-center justify-center">
                {event.type === 'daily' ? (
                  <Zap className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Plus className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[320px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              删除事件
            </AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除「{eventToDelete?.name}」吗？相关的所有记录也会被删除，此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
