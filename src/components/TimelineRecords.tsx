import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { EventRecord, Event } from '@/types';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getColorClasses, hexToRgba } from '@/lib/colorUtils';

interface TimelineRecordsProps {
  date: string;
  records: EventRecord[];
  events: Event[];
  showAllDates?: boolean;
}

// Preset color classes matching EventGrid
const presetCardClasses: { [key: string]: string } = {
  amber: 'bg-amber-50 border-amber-100',
  rose: 'bg-rose-50 border-rose-100',
  emerald: 'bg-emerald-50 border-emerald-100',
  sky: 'bg-sky-50 border-sky-100',
  violet: 'bg-violet-50 border-violet-100',
  orange: 'bg-orange-50 border-orange-100',
};

const presetDotClasses: { [key: string]: string } = {
  amber: 'bg-amber-400',
  rose: 'bg-rose-400',
  emerald: 'bg-emerald-400',
  sky: 'bg-sky-400',
  violet: 'bg-violet-400',
  orange: 'bg-orange-400',
};

export const TimelineRecords = ({ date, records, events, showAllDates = false }: TimelineRecordsProps) => {
  const getEventById = (eventId: string) => events.find(e => e.id === eventId);
  
  // Group records by date if showAllDates is true
  const groupedRecords = useMemo(() => {
    if (!showAllDates) {
      return { [date]: records };
    }
    
    const groups: { [date: string]: EventRecord[] } = {};
    records.forEach(record => {
      if (!groups[record.date]) groups[record.date] = [];
      groups[record.date].push(record);
    });
    
    // Sort dates in descending order (most recent first)
    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));
    const sortedGroups: { [date: string]: EventRecord[] } = {};
    sortedDates.forEach(d => {
      sortedGroups[d] = groups[d];
    });
    
    return sortedGroups;
  }, [records, date, showAllDates]);

  const renderDateSection = (sectionDate: string, sectionRecords: EventRecord[]) => {
    // Sort records by time
    const sortedRecords = [...sectionRecords].sort((a, b) => {
      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return timeB.localeCompare(timeA); // Most recent first
    });

    const parsedDate = parseISO(sectionDate);
    const weekDay = format(parsedDate, 'EEEE', { locale: zhCN });
    const displayDate = format(parsedDate, 'yyyy年 MM月dd日', { locale: zhCN });

    return (
      <div key={sectionDate} className="bg-muted/30 rounded-2xl p-4">
        {/* Date Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">{weekDay}</span>
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-medium">{displayDate}</span>
        </div>

        {/* Timeline */}
        {sortedRecords.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            这一天没有记录
          </p>
        ) : (
          <div className="relative ml-1">
            {/* Timeline Line - positioned to go through dot centers */}
            <div className="absolute left-[3px] top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-3">
              {sortedRecords.map((record) => {
                const event = getEventById(record.eventId);
                if (!event) return null;
                
                const colorInfo = getColorClasses(event.color);
                const isCustomColor = colorInfo.isCustom;
                
                // Card styling
                const cardClassName = isCustomColor 
                  ? 'border' 
                  : presetCardClasses[event.color || 'sky'] || presetCardClasses.sky;
                const customCardStyle = isCustomColor ? {
                  backgroundColor: hexToRgba(colorInfo.hex, 0.1),
                  borderColor: hexToRgba(colorInfo.hex, 0.2),
                } : undefined;
                
                // Dot styling
                const dotClassName = isCustomColor 
                  ? '' 
                  : presetDotClasses[event.color || 'sky'] || presetDotClasses.sky;
                const customDotStyle = isCustomColor ? {
                  backgroundColor: colorInfo.hex,
                } : undefined;
                
                return (
                  <div key={record.id} className="relative flex items-start gap-3 pl-5">
                    {/* Timeline Dot - centered on the line */}
                    <div 
                      className={cn(
                        'absolute left-0 top-3 w-2 h-2 rounded-full',
                        dotClassName
                      )}
                      style={customDotStyle}
                    />
                    
                    {/* Time */}
                    <span className="text-xs text-muted-foreground min-w-[36px] pt-2.5">
                      {record.time || '--:--'}
                    </span>
                    
                    {/* Card */}
                    <div 
                      className={cn(
                        'flex-1 rounded-xl p-3 border',
                        cardClassName
                      )}
                      style={customCardStyle}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{event.icon}</span>
                        <span className="font-medium text-sm">{event.name}</span>
                      </div>
                      {record.note && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {record.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const dateKeys = Object.keys(groupedRecords);

  if (dateKeys.length === 0) {
    return (
      <div className="bg-muted/30 rounded-2xl p-4 animate-fade-in">
        <p className="text-sm text-muted-foreground text-center py-4">
          暂无记录
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {dateKeys.map(d => renderDateSection(d, groupedRecords[d]))}
    </div>
  );
};
