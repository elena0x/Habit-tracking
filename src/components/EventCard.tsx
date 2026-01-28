import { cn } from '@/lib/utils';
import type { Event, EventRecord } from '@/types';
import { formatRelativeTime } from '@/lib/dateUtils';

interface EventCardProps {
  event: Event;
  lastRecord: EventRecord | null;
  onQuickRecord: () => void;
  onClick?: () => void;
}

const colorClasses: { [key: string]: string } = {
  amber: 'bg-accent hover:bg-accent/80 border-primary/20',
  rose: 'bg-rose-50 hover:bg-rose-100/80 border-rose-200',
  emerald: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200',
  sky: 'bg-sky-50 hover:bg-sky-100/80 border-sky-200',
  violet: 'bg-violet-50 hover:bg-violet-100/80 border-violet-200',
  orange: 'bg-orange-50 hover:bg-orange-100/80 border-orange-200',
};

export const EventCard = ({ event, lastRecord, onQuickRecord }: EventCardProps) => {
  const colorClass = colorClasses[event.color || 'amber'] || colorClasses.amber;

  return (
    <button
      onClick={onQuickRecord}
      className={cn(
        'w-full p-5 rounded-2xl border transition-all duration-200',
        'flex items-center gap-4 text-left',
        'active:scale-[0.98] hover:shadow-card',
        colorClass
      )}
    >
      <div className="text-3xl flex-shrink-0">
        {event.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate">
          {event.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {lastRecord ? formatRelativeTime(lastRecord.createdAt) : '还没有记录'}
        </p>
      </div>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background/50 flex items-center justify-center">
        <span className="text-muted-foreground text-lg">+</span>
      </div>
    </button>
  );
};
