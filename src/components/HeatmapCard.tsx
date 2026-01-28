import { useMemo } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Check, Sun } from 'lucide-react';
import type { Event, EventRecord } from '@/types';

interface HeatmapCardProps {
  event: Event;
  records: EventRecord[];
  currentMonth: Date;
}

export const HeatmapCard = ({ event, records, currentMonth }: HeatmapCardProps) => {
  const monthDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });
  }, [currentMonth]);

  const recordDates = useMemo(() => {
    return new Set(records.map(r => r.date));
  }, [records]);

  const firstDayOffset = getDay(startOfMonth(currentMonth));
  const recordCount = records.length;
  const daysWithRecords = recordDates.size;

  const colorClasses: { [key: string]: string } = {
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    emerald: 'bg-emerald-400',
    sky: 'bg-sky-400',
    violet: 'bg-violet-400',
    orange: 'bg-orange-400',
  };

  const iconBgClasses: { [key: string]: string } = {
    amber: 'bg-amber-100',
    rose: 'bg-rose-100',
    emerald: 'bg-emerald-100',
    sky: 'bg-sky-100',
    violet: 'bg-violet-100',
    orange: 'bg-orange-100',
  };

  const dotColor = colorClasses[event.color || 'sky'] || colorClasses.sky;
  const iconBg = iconBgClasses[event.color || 'sky'] || iconBgClasses.sky;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconBg)}>
          <span className="text-base">{event.icon}</span>
        </div>
        <span className="font-medium">{event.name}</span>
      </div>

      {/* Mini Heatmap */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {monthDays.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const hasRecord = recordDates.has(dateStr);
          
          return (
            <div
              key={dateStr}
              className={cn(
                'aspect-square rounded-sm flex items-center justify-center',
                hasRecord ? dotColor : 'bg-muted/50'
              )}
            >
              {hasRecord && (
                <Check className="w-2.5 h-2.5 text-white" />
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-around text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Check className="w-4 h-4" />
          <span>{recordCount}</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1">
          <Sun className="w-4 h-4" />
          <span>{daysWithRecords}</span>
        </div>
      </div>
    </div>
  );
};
