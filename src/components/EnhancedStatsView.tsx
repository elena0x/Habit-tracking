import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  addMonths, subMonths, format, startOfMonth, subDays, addDays,
  startOfWeek, endOfWeek, addWeeks, subWeeks,
  startOfYear, endOfYear, addYears, subYears,
  eachDayOfInterval, eachMonthOfInterval
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { HeatmapCard } from './HeatmapCard';
import type { EventRecord, Event } from '@/types';

type TimeRange = 'week' | 'month' | 'year';

interface EnhancedStatsViewProps {
  records: EventRecord[];
  events: Event[];
}

export const EnhancedStatsView = ({ records, events }: EnhancedStatsViewProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Navigation handlers based on time range
  const goToPrevious = () => {
    if (timeRange === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else if (timeRange === 'month') {
      setCurrentDate(prev => subMonths(prev, 1));
    } else {
      setCurrentDate(prev => subYears(prev, 1));
    }
  };

  const goToNext = () => {
    if (timeRange === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else if (timeRange === 'month') {
      setCurrentDate(prev => addMonths(prev, 1));
    } else {
      setCurrentDate(prev => addYears(prev, 1));
    }
  };

  // Get date range based on time range selection
  const dateRange = useMemo(() => {
    if (timeRange === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return { start: weekStart, end: weekEnd };
    } else if (timeRange === 'month') {
      return { start: startOfMonth(currentDate), end: addDays(startOfMonth(addMonths(currentDate, 1)), -1) };
    } else {
      return { start: startOfYear(currentDate), end: endOfYear(currentDate) };
    }
  }, [timeRange, currentDate]);

  // Format display title
  const displayTitle = useMemo(() => {
    if (timeRange === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(weekStart, 'MM/dd', { locale: zhCN })} - ${format(weekEnd, 'MM/dd', { locale: zhCN })}`;
    } else if (timeRange === 'month') {
      return format(currentDate, 'yyyy年 MM月', { locale: zhCN });
    } else {
      return format(currentDate, 'yyyy年', { locale: zhCN });
    }
  }, [timeRange, currentDate]);

  // Filter records based on time range
  const filteredRecords = useMemo(() => {
    const startStr = format(dateRange.start, 'yyyy-MM-dd');
    const endStr = format(dateRange.end, 'yyyy-MM-dd');
    return records.filter(r => r.date >= startStr && r.date <= endStr);
  }, [records, dateRange]);

  const stats = useMemo(() => {
    const now = new Date();
    const uniqueDates = new Set(filteredRecords.map(r => r.date));
    const uniqueRecordDates = new Set(records.map(r => r.date));
    
    // Calculate days since first use
    const sortedDates = [...uniqueRecordDates].sort();
    const firstDate = sortedDates[0];
    const daysSinceStart = firstDate 
      ? Math.floor((now.getTime() - new Date(firstDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0;

    return {
      totalEvents: events.length,
      totalRecords: filteredRecords.length,
      usageDays: daysSinceStart,
      recordDays: uniqueDates.size,
    };
  }, [records, events, filteredRecords]);

  // Group records by event for heatmap
  const recordsByEvent = useMemo(() => {
    const map: { [eventId: string]: EventRecord[] } = {};
    filteredRecords.forEach(r => {
      if (!map[r.eventId]) map[r.eventId] = [];
      map[r.eventId].push(r);
    });
    return map;
  }, [filteredRecords]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl p-4 shadow-soft">
          <p className="text-2xl font-semibold text-foreground">
            {stats.totalEvents} <span className="text-base font-normal text-muted-foreground">个</span>
          </p>
          <p className="text-sm text-muted-foreground">事件总数</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-soft">
          <p className="text-2xl font-semibold text-foreground">
            {stats.totalRecords} <span className="text-base font-normal text-muted-foreground">次</span>
          </p>
          <p className="text-sm text-muted-foreground">记录次数</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-soft">
          <p className="text-2xl font-semibold text-foreground">
            {stats.usageDays} <span className="text-base font-normal text-muted-foreground">天</span>
          </p>
          <p className="text-sm text-muted-foreground">使用天数</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-soft">
          <p className="text-2xl font-semibold text-foreground">
            {stats.recordDays} <span className="text-base font-normal text-muted-foreground">天</span>
          </p>
          <p className="text-sm text-muted-foreground">记录天数</p>
        </div>
      </div>

      {/* Time Range Toggle */}
      <div className="flex bg-muted rounded-xl p-1">
        {(['week', 'month', 'year'] as TimeRange[]).map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
              timeRange === range
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {range === 'week' && '周'}
            {range === 'month' && '月'}
            {range === 'year' && '年'}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={goToPrevious}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <span className="text-base font-medium min-w-[140px] text-center">
          {displayTitle}
        </span>
        <button 
          onClick={goToNext}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Event Heatmaps */}
      {events.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          还没有任何事件
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {events.map(event => (
            <HeatmapCard
              key={event.id}
              event={event}
              records={recordsByEvent[event.id] || []}
              currentDate={currentDate}
              timeRange={timeRange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
