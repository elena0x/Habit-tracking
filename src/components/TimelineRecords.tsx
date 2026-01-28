import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { EventRecord, Event } from '@/types';

interface TimelineRecordsProps {
  date: string;
  records: EventRecord[];
  events: Event[];
}

export const TimelineRecords = ({ date, records, events }: TimelineRecordsProps) => {
  const getEventById = (eventId: string) => events.find(e => e.id === eventId);
  
  // Sort records by time
  const sortedRecords = [...records].sort((a, b) => {
    const timeA = a.time || '00:00';
    const timeB = b.time || '00:00';
    return timeA.localeCompare(timeB);
  });

  const parsedDate = parseISO(date);
  const weekDay = format(parsedDate, 'EEEE', { locale: zhCN });
  const displayDate = format(parsedDate, 'yyyy年 MM月dd日', { locale: zhCN });

  return (
    <div className="bg-muted/30 rounded-2xl p-4 animate-fade-in">
      {/* Date Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">{weekDay}</span>
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="font-medium">{displayDate}</span>
      </div>

      {/* Timeline */}
      {sortedRecords.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          这一天没有记录
        </p>
      ) : (
        <div className="relative pl-6">
          {/* Timeline Line */}
          <div className="absolute left-2 top-0 bottom-0 w-px bg-primary/20" />
          
          <div className="space-y-4">
            {sortedRecords.map((record, index) => {
              const event = getEventById(record.eventId);
              if (!event) return null;
              
              return (
                <div key={record.id} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-4 top-1 w-2 h-2 rounded-full border-2 border-primary bg-background" />
                  
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-primary font-medium min-w-[40px]">
                      {record.time || '--:--'}
                    </span>
                    <div className="flex-1 bg-background rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{event.icon}</span>
                        <span className="font-medium text-sm">{event.name}</span>
                      </div>
                      {record.note && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {record.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
