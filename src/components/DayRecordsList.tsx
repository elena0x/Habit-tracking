import { formatDisplayDate } from '@/lib/dateUtils';
import type { EventRecord, Event } from '@/types';
import { cn } from '@/lib/utils';

interface DayRecordsListProps {
  date: string;
  records: EventRecord[];
  events: Event[];
  onDeleteRecord?: (id: string) => void;
}

const colorClasses: { [key: string]: string } = {
  amber: 'bg-amber-100 border-amber-200',
  rose: 'bg-rose-100 border-rose-200',
  emerald: 'bg-emerald-100 border-emerald-200',
  sky: 'bg-sky-100 border-sky-200',
  violet: 'bg-violet-100 border-violet-200',
  orange: 'bg-orange-100 border-orange-200',
};

export const DayRecordsList = ({ date, records, events }: DayRecordsListProps) => {
  const getEvent = (eventId: string) => events.find(e => e.id === eventId);

  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No check-ins on this day</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        {formatDisplayDate(date)}
      </h3>
      <div className="space-y-2">
        {records.map(record => {
          const event = getEvent(record.eventId);
          if (!event) return null;
          
          const colorClass = colorClasses[event.color || 'amber'] || colorClasses.amber;

          return (
            <div
              key={record.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border',
                colorClass
              )}
            >
              <span className="text-xl">{event.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-sm">{event.name}</p>
                {record.time && (
                  <p className="text-xs text-muted-foreground">{record.time}</p>
                )}
              </div>
              {record.note && (
                <p className="text-xs text-muted-foreground max-w-[120px] truncate">
                  {record.note}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
