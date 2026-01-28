import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, format, startOfMonth, subDays } from 'date-fns';
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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

  const monthStr = format(currentMonth, 'yyyy-MM');
  
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(currentMonth);
    
    // Filter records by time range
    let filteredRecords = records;
    if (timeRange === 'month') {
      filteredRecords = records.filter(r => r.date.startsWith(monthStr));
    } else if (timeRange === 'week') {
      const weekAgo = format(subDays(now, 7), 'yyyy-MM-dd');
      filteredRecords = records.filter(r => r.date >= weekAgo);
    }
    
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
  }, [records, events, timeRange, monthStr, currentMonth]);

  const monthRecordsByEvent = useMemo(() => {
    const map: { [eventId: string]: EventRecord[] } = {};
    records
      .filter(r => r.date.startsWith(monthStr))
      .forEach(r => {
        if (!map[r.eventId]) map[r.eventId] = [];
        map[r.eventId].push(r);
      });
    return map;
  }, [records, monthStr]);

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

      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={goToPreviousMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <span className="text-base font-medium">
          {format(currentMonth, 'yyyy年 MM月', { locale: zhCN })}
        </span>
        <button 
          onClick={goToNextMonth}
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
              records={monthRecordsByEvent[event.id] || []}
              currentMonth={currentMonth}
            />
          ))}
        </div>
      )}
    </div>
  );
};
