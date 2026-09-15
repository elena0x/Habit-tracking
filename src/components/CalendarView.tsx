import { useState, useMemo } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatMonth, formatDate, isTodayDate } from '@/lib/dateUtils';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import type { EventRecord, Event } from '@/types';

interface CalendarViewProps {
  records: EventRecord[];
  events: Event[];
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export const CalendarView = ({ records, events, onDateSelect, selectedDate }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
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

  const { onTouchStart, onTouchEnd } = useSwipeGesture({
    onSwipeLeft: goToNextMonth,
    onSwipeRight: goToPreviousMonth,
  });

  const colorBgClasses: { [key: string]: string } = {
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    emerald: 'bg-emerald-400',
    sky: 'bg-sky-400',
    violet: 'bg-violet-400',
    orange: 'bg-orange-400',
  };

  return (
    <div 
      className="animate-fade-in -mx-5"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Month Header */}
      <div className="flex items-center justify-between px-5 mb-4">
        <span className="text-lg font-medium">
          {formatMonth(currentMonth)}
        </span>
        <button 
          onClick={() => setCurrentMonth(new Date())}
          className="px-3 py-1 text-sm rounded-full hover:bg-muted transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="px-2">
        {/* Week Headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm text-muted-foreground py-2 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day) => {
            const dateStr = formatDate(day);
            const dayRecords = recordsByDate[dateStr] || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate === dateStr;
            const isToday = isTodayDate(day);
            
            const eventColors = [...new Set(dayRecords.map(r => {
              const event = events.find(e => e.id === r.eventId);
              return event?.color || 'amber';
            }))];

            return (
              <button
                key={dateStr}
                aria-label={`${isToday ? 'Today, ' : ''}${dateStr}${dayRecords.length ? `, ${dayRecords.length} check-ins` : ''}`}
                onClick={() => onDateSelect(dateStr)}
                className={cn(
                  'min-h-[72px] p-1 flex flex-col items-center border-b border-r border-border/50 transition-colors',
                  isSelected && 'bg-accent',
                  !isCurrentMonth && 'opacity-40',
                )}
              >
                <span className={cn(
                  'text-sm w-7 h-7 flex items-center justify-center rounded-full mb-1',
                  isToday && 'bg-primary text-primary-foreground font-medium',
                  !isToday && isCurrentMonth && 'text-foreground',
                  !isToday && !isCurrentMonth && 'text-muted-foreground'
                )}>
                  {day.getDate()}
                </span>
                
                {eventColors.length > 0 && (
                  <div className="flex w-full h-1.5 rounded-full overflow-hidden mt-auto mb-1 mx-1">
                    {eventColors.map((color, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          'flex-1 h-full',
                          colorBgClasses[color]
                        )}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
