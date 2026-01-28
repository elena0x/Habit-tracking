import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, startOfMonth, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatMonth, formatDate, getMonthDays, getWeekDays, isTodayDate } from '@/lib/dateUtils';
import type { EventRecord, Event } from '@/types';

interface CalendarViewProps {
  records: EventRecord[];
  events: Event[];
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export const CalendarView = ({ records, events, onDateSelect, selectedDate }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthDays = useMemo(() => getMonthDays(currentMonth), [currentMonth]);
  const weekDays = getWeekDays();
  
  const recordsByDate = useMemo(() => {
    const map: { [date: string]: EventRecord[] } = {};
    records.forEach(record => {
      if (!map[record.date]) map[record.date] = [];
      map[record.date].push(record);
    });
    return map;
  }, [records]);

  const firstDayOffset = getDay(startOfMonth(currentMonth));

  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

  const getEventColor = (eventId: string): string => {
    const event = events.find(e => e.id === eventId);
    return event?.color || 'amber';
  };

  const colorDotClasses: { [key: string]: string } = {
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    emerald: 'bg-emerald-400',
    sky: 'bg-sky-400',
    violet: 'bg-violet-400',
    orange: 'bg-orange-400',
  };

  return (
    <div className="animate-fade-in">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={goToPreviousMonth}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="text-lg font-medium">{formatMonth(currentMonth)}</h2>
        <button 
          onClick={goToNextMonth}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Week Headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {/* Day cells */}
        {monthDays.map(day => {
          const dateStr = formatDate(day);
          const dayRecords = recordsByDate[dateStr] || [];
          const hasRecords = dayRecords.length > 0;
          const isSelected = selectedDate === dateStr;
          const isToday = isTodayDate(day);
          
          // Get unique event names for this day (show up to 2)
          const eventNames = [...new Set(dayRecords.map(r => {
            const event = events.find(e => e.id === r.eventId);
            return event?.name || '';
          }))].filter(Boolean).slice(0, 2);

          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect(dateStr)}
              className={cn(
                'aspect-square rounded-xl flex flex-col items-center justify-center transition-all p-1 relative',
                isSelected && 'bg-primary text-primary-foreground',
                !isSelected && hasRecords && 'bg-accent',
                !isSelected && !hasRecords && 'hover:bg-muted/50',
              )}
            >
              {/* Today indicator */}
              {isToday && !isSelected ? (
                <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium">
                  今
                </span>
              ) : (
                <span className={cn(
                  'text-sm',
                  isSelected ? 'font-medium' : 'text-foreground',
                  !hasRecords && !isSelected && 'text-muted-foreground'
                )}>
                  {day.getDate()}
                </span>
              )}
              
              {/* Event name tags (only when not selected) */}
              {hasRecords && !isSelected && eventNames.length > 0 && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[10px] text-primary font-medium px-1 py-0.5 bg-primary/10 rounded">
                    {eventNames[0]}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
