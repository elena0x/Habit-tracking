import { cn } from '@/lib/utils';
import { Zap, Plus } from 'lucide-react';
import type { Event, EventRecord } from '@/types';
import { formatRelativeTime } from '@/lib/dateUtils';

interface EventGridProps {
  events: Event[];
  getLastRecord: (eventId: string) => EventRecord | null;
  onQuickRecord: (eventId: string) => void;
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

export const EventGrid = ({ events, getLastRecord, onQuickRecord }: EventGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 animate-fade-in">
      {events.map(event => {
        const lastRecord = getLastRecord(event.id);
        const colorClass = colorClasses[event.color || 'sky'] || colorClasses.sky;
        const iconBgClass = iconBgClasses[event.color || 'sky'] || iconBgClasses.sky;
        
        return (
          <button
            key={event.id}
            onClick={() => onQuickRecord(event.id)}
            className={cn(
              'relative p-4 rounded-2xl border transition-all duration-200',
              'flex flex-col text-left min-h-[120px]',
              'active:scale-[0.98] hover:shadow-card',
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
  );
};
