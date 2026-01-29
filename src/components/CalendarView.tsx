import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatMonth, formatDate, isTodayDate } from '@/lib/dateUtils';
import type { EventRecord, Event } from '@/types';

interface CalendarViewProps {
  records: EventRecord[];
  events: Event[];
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export const CalendarView = ({ records, events, onDateSelect, selectedDate }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get all days to display (including days from prev/next month to fill the grid)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  
  const recordsByDate = useMemo(() => {
    const map: { [date: string]: EventRecord[] } = {};
    records.forEach(record => {
      if (!map[record.date]) map[record.date] = [];
      map[record.date].push(record);
    });
    return map;
  }, [records]);

  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

  const getEventColor = (eventId: string): string => {
    const event = events.find(e => e.id === eventId);
    return event?.color || 'amber';
  };

  const colorClasses: { [key: string]: string } = {
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    sky: 'bg-sky-100 text-sky-700',
    violet: 'bg-violet-100 text-violet-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="animate-fade-in -mx-5">
      {/* Month Header */}
      <div className="flex items-center justify-between px-5 mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="text-lg font-medium flex items-center gap-1"
        >
          <span>{formatMonth(currentMonth)}</span>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 text-sm rounded-full hover:bg-muted transition-colors"
          >
            今天
          </button>
        </div>
      </div>

      {/* Swipe hint for month navigation */}
      <div className="flex">
        <button 
          onClick={goToPreviousMonth}
          className="w-8 flex-shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          ‹
        </button>
        
        <div className="flex-1">
          {/* Week Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm text-muted-foreground py-2 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dateStr = formatDate(day);
              const dayRecords = recordsByDate[dateStr] || [];
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate === dateStr;
              const isToday = isTodayDate(day);
              
              // Get unique events for this day (show up to 2)
              const dayEvents = [...new Set(dayRecords.map(r => r.eventId))]
                .map(eventId => events.find(e => e.id === eventId))
                .filter(Boolean)
                .slice(0, 2) as Event[];

              return (
                <button
                  key={dateStr}
                  onClick={() => onDateSelect(dateStr)}
                  className={cn(
                    'min-h-[80px] p-1 flex flex-col items-center border-b border-r border-border/50 transition-colors',
                    isSelected && 'bg-accent',
                    !isCurrentMonth && 'opacity-40',
                  )}
                >
                  {/* Date number */}
                  <span className={cn(
                    'text-sm w-7 h-7 flex items-center justify-center rounded-full mb-1',
                    isToday && 'bg-primary text-primary-foreground font-medium',
                    !isToday && isCurrentMonth && 'text-foreground',
                    !isToday && !isCurrentMonth && 'text-muted-foreground'
                  )}>
                    {isToday && isCurrentMonth ? '今' : day.getDate()}
                  </span>
                  
                  {/* Event tags */}
                  <div className="flex flex-col gap-0.5 w-full px-0.5">
                    {dayEvents.map(event => (
                      <span 
                        key={event.id}
                        className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded truncate text-center',
                          colorClasses[event.color || 'amber']
                        )}
                      >
                        {event.name}
                      </span>
                    ))}
                    {dayRecords.length > 2 && (
                      <span className="text-[10px] text-muted-foreground text-center">
                        +{dayRecords.length - 2}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button 
          onClick={goToNextMonth}
          className="w-8 flex-shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          ›
        </button>
      </div>
    </div>
  );
};
