import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getColorClasses, hexToRgba } from '@/lib/colorUtils';
import { Zap, Plus, Trash2 } from 'lucide-react';
import type { Event, EventRecord } from '@/types';
import { formatRelativeTime, isRecordedToday } from '@/lib/dateUtils';
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
  getTodayRecordCount: (eventId: string) => number;
  onQuickRecord: (eventId: string) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const LONG_PRESS_DURATION = 500; // ms

// Preset color classes for non-custom colors
const presetColorClasses: { [key: string]: string } = {
  amber: 'bg-amber-50 border-amber-100',
  rose: 'bg-rose-50 border-rose-100',
  emerald: 'bg-emerald-50 border-emerald-100',
  sky: 'bg-sky-50 border-sky-100',
  violet: 'bg-violet-50 border-violet-100',
  orange: 'bg-orange-50 border-orange-100',
};

const presetIconBgClasses: { [key: string]: string } = {
  amber: 'bg-amber-100',
  rose: 'bg-rose-100',
  emerald: 'bg-emerald-100',
  sky: 'bg-sky-100',
  violet: 'bg-violet-100',
  orange: 'bg-orange-100',
};

export const EventGrid = ({ events, getLastRecord, getTodayRecordCount, onQuickRecord, onDeleteEvent }: EventGridProps) => {
  const navigate = useNavigate();
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

  const handleCardClick = useCallback((event: Event) => {
    if (!isLongPressRef.current) {
      // If quick record is enabled, record immediately instead of navigating
      if (event.quickRecord) {
        onQuickRecord(event.id);
      } else {
        navigate(`/event/${event.id}`);
      }
    }
    isLongPressRef.current = false;
  }, [navigate, onQuickRecord]);

  const handleQuickRecordClick = useCallback((e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    onQuickRecord(eventId);
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
          const todayCount = getTodayRecordCount(event.id);
          const hasRecordedToday = todayCount > 0;
          const colorInfo = getColorClasses(event.color);
          const isCustomColor = colorInfo.isCustom;
          
          // Use preset classes or custom styles
          const cardClassName = isCustomColor 
            ? '' 
            : presetColorClasses[event.color || 'sky'] || presetColorClasses.sky;
          const iconBgClassName = isCustomColor 
            ? '' 
            : presetIconBgClasses[event.color || 'sky'] || presetIconBgClasses.sky;
          
          const customCardStyle = isCustomColor ? {
            backgroundColor: hexToRgba(colorInfo.hex, 0.1),
            borderColor: hexToRgba(colorInfo.hex, 0.2),
          } : undefined;
          
          const customIconBgStyle = isCustomColor ? {
            backgroundColor: hexToRgba(colorInfo.hex, 0.2),
          } : undefined;

          // Determine icon based on quickRecord status
          const isQuickRecord = event.quickRecord;
          
          return (
            <div
              key={event.id}
              onClick={() => handleCardClick(event)}
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
                'relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer',
                'flex flex-col text-left min-h-[120px]',
                'active:scale-[0.98] hover:shadow-card select-none',
                cardClassName
              )}
              style={customCardStyle}
            >
              {/* Icon */}
              <div 
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center mb-3',
                  iconBgClassName
                )}
                style={customIconBgStyle}
              >
                <span className="text-xl">{event.icon}</span>
              </div>
              
              {/* Event Name */}
              <h3 className="font-medium text-foreground text-sm mb-1 truncate">
                {event.name}
              </h3>
              
              {/* Last Record */}
              <p className="text-xs text-muted-foreground">
                {hasRecordedToday 
                  ? `今日已记 ${todayCount} 次` 
                  : `上次：${lastRecord ? formatRelativeTime(lastRecord.createdAt) : '–'}`
                }
              </p>
              
              {/* Quick Action Button */}
              <button
                onClick={(e) => handleQuickRecordClick(e, event.id)}
                className={cn(
                  'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all',
                  hasRecordedToday
                    ? 'bg-primary/20 shadow-sm scale-110'
                    : 'bg-background/80 hover:bg-background'
                )}
              >
                {isQuickRecord ? (
                  <Zap className={cn(
                    'w-4 h-4 transition-all',
                    hasRecordedToday ? 'text-primary fill-primary' : 'text-primary'
                  )} />
                ) : (
                  <Plus className={cn(
                    'w-4 h-4 transition-all',
                    hasRecordedToday ? 'text-primary' : 'text-muted-foreground'
                  )} />
                )}
              </button>
            </div>
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
