import { useState, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Calendar, Clock, FileText, Pencil } from 'lucide-react';
import { format, parseISO, startOfMonth, eachDayOfInterval, subMonths, subWeeks } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useEvents } from '@/hooks/useEvents';
import { useRecords } from '@/hooks/useRecords';
import { EditEventSheet } from '@/components/EditEventSheet';
import { cn } from '@/lib/utils';
import { getColorClasses, hexToRgba } from '@/lib/colorUtils';
import type { EventType } from '@/types';

// Preset color classes
const presetColorClasses: { [key: string]: { bg: string; iconBg: string; accent: string } } = {
  amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', accent: 'bg-amber-500' },
  rose: { bg: 'bg-rose-50', iconBg: 'bg-rose-100', accent: 'bg-rose-500' },
  emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', accent: 'bg-emerald-500' },
  sky: { bg: 'bg-sky-50', iconBg: 'bg-sky-100', accent: 'bg-sky-500' },
  violet: { bg: 'bg-violet-50', iconBg: 'bg-violet-100', accent: 'bg-violet-500' },
  orange: { bg: 'bg-orange-50', iconBg: 'bg-orange-100', accent: 'bg-orange-500' },
};

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEventById, updateEvent } = useEvents();
  const { records, getRecordsByEvent } = useRecords();
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  // Swipe-back gesture
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const handleSwipeStart = useCallback((e: React.TouchEvent) => {
    // Only trigger from left edge (within 30px)
    if (e.touches[0].clientX < 30) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);
  const handleSwipeEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (deltaX > 80 && Math.abs(deltaX) > Math.abs(deltaY) * 2) {
      navigate(-1);
    }
  }, [navigate]);

  const event = eventId ? getEventById(eventId) : null;
  const eventRecords = useMemo(
    () => eventId ? getRecordsByEvent(eventId) : [],
    [eventId, getRecordsByEvent],
  );

  const handleUpdateEvent = (id: string, data: { name: string; type: EventType; icon: string; color: string }) => {
    updateEvent(id, data);
  };

  // Sort records by date (newest first)
  const sortedRecords = useMemo(() => {
    return [...eventRecords].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [eventRecords]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (eventRecords.length === 0) {
      return { total: 0, thisMonth: 0, activeDays: 0, avgPerWeek: 0 };
    }

    const now = new Date();
    const currentMonth = format(now, 'yyyy-MM');
    const thisMonthRecords = eventRecords.filter(r => r.date.startsWith(currentMonth));
    const uniqueDays = new Set(eventRecords.map(r => r.date));
    
    // Calculate average per week (last 4 weeks)
    const fourWeeksAgo = subWeeks(now, 4);
    const recentRecords = eventRecords.filter(r => parseISO(r.date) >= fourWeeksAgo);
    const avgPerWeek = Math.round((recentRecords.length / 4) * 10) / 10;

    return {
      total: eventRecords.length,
      thisMonth: thisMonthRecords.length,
      activeDays: uniqueDays.size,
      avgPerWeek,
    };
  }, [eventRecords]);

  // Generate heatmap data for last 3 months
  const heatmapData = useMemo(() => {
    const now = new Date();
    const threeMonthsAgo = subMonths(startOfMonth(now), 2);
    const days = eachDayOfInterval({ start: threeMonthsAgo, end: now });
    
    const recordCountByDate: { [key: string]: number } = {};
    eventRecords.forEach(record => {
      recordCountByDate[record.date] = (recordCountByDate[record.date] || 0) + 1;
    });

    return days.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      count: recordCountByDate[format(day, 'yyyy-MM-dd')] || 0,
    }));
  }, [eventRecords]);

  const maxCount = Math.max(...heatmapData.map(d => d.count), 1);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Habit not found</p>
      </div>
    );
  }

  const colorInfo = getColorClasses(event.color);
  const isCustomColor = colorInfo.isCustom;
  const colors = presetColorClasses[event.color || 'amber'] || presetColorClasses.amber;
  
  // Custom color styles
  const customBgStyle = isCustomColor ? { backgroundColor: hexToRgba(colorInfo.hex, 0.1) } : undefined;
  const customIconBgStyle = isCustomColor ? { backgroundColor: hexToRgba(colorInfo.hex, 0.2) } : undefined;
  const customAccentStyle = isCustomColor ? { backgroundColor: colorInfo.hex } : undefined;

  return (
    <div className="min-h-screen bg-background pb-8" onTouchStart={handleSwipeStart} onTouchEnd={handleSwipeEnd}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-3">
          <button
            aria-label="Go back"
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold flex-1">Habit details</h1>
          <button
            aria-label="Edit habit"
            onClick={() => setEditSheetOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted"
          >
            <Pencil className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6 space-y-6">
        {/* Event Header Card */}
        <div 
          className={cn('rounded-2xl p-6', !isCustomColor && colors.bg)}
          style={customBgStyle}
        >
          <div className="flex items-center gap-4">
            <div 
              className={cn('w-16 h-16 rounded-2xl flex items-center justify-center', !isCustomColor && colors.iconBg)}
              style={customIconBgStyle}
            >
              <span className="text-3xl">{event.icon}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {event.type === 'once' && 'One-time event'}
                {event.type === 'daily' && 'Repeatable habit'}
                {event.type === 'log' && 'Detailed log'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Total check-ins</span>
            </div>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>
          <div className="bg-muted/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">This month</span>
            </div>
            <p className="text-2xl font-semibold">{stats.thisMonth}</p>
          </div>
          <div className="bg-muted/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Active days</span>
            </div>
            <p className="text-2xl font-semibold">{stats.activeDays}</p>
          </div>
          <div className="bg-muted/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Weekly average</span>
            </div>
            <p className="text-2xl font-semibold">{stats.avgPerWeek}</p>
          </div>
        </div>

        {/* Mini Heatmap */}
        <div className="bg-muted/30 rounded-2xl p-4">
          <h3 className="text-sm font-medium mb-3">Activity heatmap</h3>
          <div className="flex flex-wrap gap-1">
            {heatmapData.slice(-42).map((day, index) => {
              const opacity = day.count === 0 ? 0.1 : 0.3 + (day.count / maxCount) * 0.7;
              const heatmapStyle = isCustomColor 
                ? { backgroundColor: colorInfo.hex, opacity } 
                : { opacity };
              return (
                <div
                  key={index}
                  className={cn('w-4 h-4 rounded-sm', !isCustomColor && colors.accent)}
                  style={heatmapStyle}
                  title={`${day.date}: ${day.count} check-in${day.count === 1 ? '' : 's'}`}
                />
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Last 6 weeks</p>
        </div>

        {/* Records Timeline */}
        <div className="bg-muted/30 rounded-2xl p-4">
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Check-in history
          </h3>
          
          {sortedRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No check-ins yet
            </p>
          ) : (
            <div className="relative max-h-[400px] overflow-y-auto" style={{ paddingLeft: '20px' }}>
              {/* Timeline Line - centered at 5px from left (center of 10px dot) */}
              <div className="absolute top-0 bottom-0 w-[1px] bg-border" style={{ left: '4.5px' }} />
              
              <div className="space-y-4">
              {sortedRecords.slice(0, 50).map((record) => {
                const recordDate = parseISO(record.date);
                const displayDate = format(recordDate, 'MMM d', { locale: enUS });
                const weekDay = format(recordDate, 'EEEE', { locale: enUS });
                
                return (
                  <div key={record.id} className="relative">
                    {/* Timeline Dot - 10px wide, left edge at 0px, center at 5px = line center */}
                    <div 
                      className={cn(
                        'absolute w-2.5 h-2.5 rounded-full border-2 border-background',
                        !isCustomColor && colors.accent
                      )}
                      style={{ left: '-20px', top: '6px', ...customAccentStyle }}
                    />
                    
                    <div className="bg-background rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{displayDate} {weekDay}</span>
                        <span className="text-xs text-muted-foreground">{record.time || '--:--'}</span>
                      </div>
                      {record.note && (
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                          {record.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {sortedRecords.length > 50 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Showing the 50 most recent check-ins
                </p>
              )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Event Sheet */}
      <EditEventSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        event={event}
        onSubmit={handleUpdateEvent}
      />
    </div>
  );
};

export default EventDetailPage;
