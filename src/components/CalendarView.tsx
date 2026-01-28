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
          
          // Get unique event colors for this day
          const eventColors = [...new Set(dayRecords.map(r => getEventColor(r.eventId)))].slice(0, 3);

          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect(dateStr)}
              className={cn(
                'aspect-square rounded-xl flex flex-col items-center justify-center transition-all p-1',
                isSelected && 'bg-primary text-primary-foreground',
                !isSelected && hasRecords && 'bg-accent',
                !isSelected && !hasRecords && 'hover:bg-muted/50',
                isToday && !isSelected && 'ring-2 ring-primary/30'
              )}
            >
              <span className={cn(
                'text-sm',
                isSelected ? 'font-medium' : 'text-foreground',
                !hasRecords && !isSelected && 'text-muted-foreground'
              )}>
                {day.getDate()}
              </span>
              
              {/* Event dots */}
              {hasRecords && !isSelected && (
                <div className="flex gap-0.5 mt-1">
                  {eventColors.map((color, i) => (
                    <div 
                      key={i}
                      className={cn('w-1.5 h-1.5 rounded-full', colorDotClasses[color] || colorDotClasses.amber)}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
