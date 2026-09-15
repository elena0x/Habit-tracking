import { useMemo } from 'react';
import { 
  startOfMonth, endOfMonth, eachDayOfInterval, format, getDay,
  startOfWeek, endOfWeek, startOfYear, eachMonthOfInterval
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getColorClasses, hexToRgba } from '@/lib/colorUtils';
import { Check, Sun } from 'lucide-react';
import type { Event, EventRecord } from '@/types';

type TimeRange = 'week' | 'month' | 'year';

interface HeatmapCardProps {
  event: Event;
  records: EventRecord[];
  currentDate: Date;
  timeRange: TimeRange;
}

// Preset color classes
const presetColorClasses: { [key: string]: string } = {
  amber: 'bg-amber-400',
  rose: 'bg-rose-400',
  emerald: 'bg-emerald-400',
  sky: 'bg-sky-400',
  violet: 'bg-violet-400',
  orange: 'bg-orange-400',
};

const presetIconBgClasses: { [key: string]: string } = {
  amber: 'bg-amber-100',
  rose: 'bg-rose-100',
  emerald: 'bg-emerald-100',
  sky: 'bg-sky-100',
  violet: 'bg-violet-100',
  orange: 'bg-orange-100',
};

export const HeatmapCard = ({ event, records, currentDate, timeRange }: HeatmapCardProps) => {
  const colorInfo = getColorClasses(event.color);
  const isCustomColor = colorInfo.isCustom;
  
  const dotColor = isCustomColor ? '' : presetColorClasses[event.color || 'sky'] || presetColorClasses.sky;
  const iconBg = isCustomColor ? '' : presetIconBgClasses[event.color || 'sky'] || presetIconBgClasses.sky;
  
  const customDotStyle = useMemo(
    () => isCustomColor ? { backgroundColor: colorInfo.hex } : undefined,
    [colorInfo.hex, isCustomColor],
  );
  const customIconBgStyle = isCustomColor ? { backgroundColor: hexToRgba(colorInfo.hex, 0.2) } : undefined;

  const recordDates = useMemo(() => {
    return new Set(records.map(r => r.date));
  }, [records]);

  const recordCount = records.length;
  const daysWithRecords = recordDates.size;

  // Week view - 7 days
  const weekView = useMemo(() => {
    if (timeRange !== 'week') return null;
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return (
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const hasRecord = recordDates.has(dateStr);
          const dayLabel = format(day, 'EEEEE', { locale: enUS });
          
          return (
            <div key={dateStr} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{dayLabel}</span>
              <div
                className={cn(
                  'w-6 h-6 rounded-md flex items-center justify-center',
                  hasRecord ? dotColor : 'bg-muted/50'
                )}
                style={hasRecord ? customDotStyle : undefined}
              >
                {hasRecord && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [timeRange, currentDate, recordDates, dotColor, customDotStyle]);

  // Month view - calendar grid
  const monthView = useMemo(() => {
    if (timeRange !== 'month') return null;
    const monthDays = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });
    const firstDayOffset = getDay(startOfMonth(currentDate));

    return (
      <div className="grid grid-cols-7 gap-1 mb-4">
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
              style={hasRecord ? customDotStyle : undefined}
            >
              {hasRecord && <Check className="w-2.5 h-2.5 text-white" />}
            </div>
          );
        })}
      </div>
    );
  }, [timeRange, currentDate, recordDates, dotColor, customDotStyle]);

  // Year view - 12 months
  const yearView = useMemo(() => {
    if (timeRange !== 'year') return null;
    const yearStart = startOfYear(currentDate);
    const months = eachMonthOfInterval({
      start: yearStart,
      end: new Date(yearStart.getFullYear(), 11, 31),
    });

    // Group records by month
    const recordsByMonth: { [key: string]: number } = {};
    records.forEach(r => {
      const monthKey = r.date.slice(0, 7);
      recordsByMonth[monthKey] = (recordsByMonth[monthKey] || 0) + 1;
    });

    const maxMonthRecords = Math.max(...Object.values(recordsByMonth), 1);

    return (
      <div className="grid grid-cols-4 gap-2 mb-4">
        {months.map(month => {
          const monthKey = format(month, 'yyyy-MM');
          const count = recordsByMonth[monthKey] || 0;
          const opacity = count === 0 ? 0.15 : 0.3 + (count / maxMonthRecords) * 0.7;
          const monthLabel = format(month, 'MMM', { locale: enUS });
          
          const yearDotStyle = isCustomColor 
            ? { backgroundColor: colorInfo.hex, opacity } 
            : { opacity };
          
          return (
            <div key={monthKey} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{monthLabel}</span>
              <div
                className={cn('w-full h-5 rounded-md flex items-center justify-center', dotColor)}
                style={yearDotStyle}
              >
                {count > 0 && (
                  <span className="text-[10px] text-white font-medium">{count}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [timeRange, currentDate, records, dotColor, isCustomColor, colorInfo.hex]);

  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div 
          className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconBg)}
          style={customIconBgStyle}
        >
          <span className="text-base">{event.icon}</span>
        </div>
        <span className="font-medium truncate">{event.name}</span>
      </div>

      {/* View based on time range */}
      {weekView}
      {monthView}
      {yearView}

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
