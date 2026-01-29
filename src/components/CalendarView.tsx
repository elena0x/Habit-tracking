import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth } from 'date-fns';
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

  const colorBgClasses: { [key: string]: string } = {
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    emerald: 'bg-emerald-400',
    sky: 'bg-sky-400',
    violet: 'bg-violet-400',
    orange: 'bg-orange-400',
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

      {/* Calendar with nav arrows */}
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
            {calendarDays.map((day) => {
              const dateStr = formatDate(day);
              const dayRecords = recordsByDate[dateStr] || [];
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate === dateStr;
              const isToday = isTodayDate(day);
              
              // Get unique event colors for this day
              const eventColors = [...new Set(dayRecords.map(r => {
                const event = events.find(e => e.id === r.eventId);
                return event?.color || 'amber';
              }))];

              return (
                <button
                  key={dateStr}
                  onClick={() => onDateSelect(dateStr)}
                  className={cn(
                    'min-h-[72px] p-1 flex flex-col items-center border-b border-r border-border/50 transition-colors',
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
                  
                  {/* Color bar - multiple colors joined together */}
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
