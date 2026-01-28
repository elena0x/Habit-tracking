import { useMemo } from 'react';
import type { EventRecord, Event } from '@/types';

interface StatsViewProps {
  records: EventRecord[];
  events: Event[];
}

export const StatsView = ({ records, events }: StatsViewProps) => {
  const stats = useMemo(() => {
    const uniqueDates = new Set(records.map(r => r.date));
    
    // Count records per event
    const recordsByEvent: { [eventId: string]: number } = {};
    records.forEach(r => {
      recordsByEvent[r.eventId] = (recordsByEvent[r.eventId] || 0) + 1;
    });

    // Sort events by record count
    const eventStats = events.map(event => ({
      event,
      count: recordsByEvent[event.id] || 0,
    })).sort((a, b) => b.count - a.count);

    return {
      totalEvents: events.length,
      totalRecords: records.length,
      activeDays: uniqueDates.size,
      eventStats,
    };
  }, [records, events]);

  const colorBarClasses: { [key: string]: string } = {
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    emerald: 'bg-emerald-400',
    sky: 'bg-sky-400',
    violet: 'bg-violet-400',
    orange: 'bg-orange-400',
  };

  const maxCount = Math.max(...stats.eventStats.map(s => s.count), 1);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5 text-center shadow-soft">
          <p className="text-3xl font-semibold text-primary">{stats.totalEvents}</p>
          <p className="text-sm text-muted-foreground mt-1">个事件</p>
        </div>
        <div className="bg-card rounded-2xl p-5 text-center shadow-soft">
          <p className="text-3xl font-semibold text-primary">{stats.totalRecords}</p>
          <p className="text-sm text-muted-foreground mt-1">次记录</p>
        </div>
        <div className="bg-card rounded-2xl p-5 text-center shadow-soft">
          <p className="text-3xl font-semibold text-primary">{stats.activeDays}</p>
          <p className="text-sm text-muted-foreground mt-1">天使用</p>
        </div>
      </div>

      {/* Event Distribution */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-4">事件分布</h3>
        {stats.eventStats.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            还没有任何记录
          </p>
        ) : (
          <div className="space-y-3">
            {stats.eventStats.map(({ event, count }) => (
              <div key={event.id} className="flex items-center gap-3">
                <span className="text-xl w-8">{event.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{event.name}</span>
                    <span className="text-muted-foreground">{count} 次</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${colorBarClasses[event.color || 'amber']}`}
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Motivational Quote */}
      <div className="bg-accent/50 rounded-2xl p-6 text-center">
        <p className="text-muted-foreground italic">
          "记录下来的时光，就不会悄悄溜走"
        </p>
      </div>
    </div>
  );
};
