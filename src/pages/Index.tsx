import { useState, useCallback } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useRecords } from '@/hooks/useRecords';
import { EventGrid } from '@/components/EventGrid';
import { CreateEventSheet } from '@/components/CreateEventSheet';
import { CalendarView } from '@/components/CalendarView';
import { TimelineRecords } from '@/components/TimelineRecords';
import { EnhancedStatsView } from '@/components/EnhancedStatsView';
import { BottomNav } from '@/components/BottomNav';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { EmptyState } from '@/components/EmptyState';
import { RecordToast } from '@/components/RecordToast';
import { RecordInputSheet } from '@/components/RecordInputSheet';
import Settings from '@/pages/Settings';
import type { Event, EventType } from '@/types';
import { getCurrentDate } from '@/lib/dateUtils';
import { Calendar, List } from 'lucide-react';
type TabType = 'home' | 'calendar' | 'stats' | 'settings';
type CalendarViewMode = 'calendar' | 'timeline';
const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [toastEvent, setToastEvent] = useState<Event | null>(null);
  const [recordSheetOpen, setRecordSheetOpen] = useState(false);
  const [recordSheetEvent, setRecordSheetEvent] = useState<Event | null>(null);
  const [calendarViewMode, setCalendarViewMode] = useState<CalendarViewMode>('calendar');
  const {
    events,
    addEvent,
    deleteEvent,
    getEventById
  } = useEvents();
  const {
    records,
    addRecord,
    getLastRecordForEvent,
    getRecordsByDate,
    getTodayRecordCount
  } = useRecords();
  const handleQuickRecord = useCallback((eventId: string) => {
    const event = getEventById(eventId);
    if (!event) return;

    // If event has attributes or is log type, show input sheet
    const hasAttributes = event.attributes && event.attributes.length > 0;
    if (hasAttributes || event.type === 'log') {
      setRecordSheetEvent(event);
      setRecordSheetOpen(true);
      return;
    }

    // For events without attributes, record immediately
    addRecord(eventId);
    setToastEvent(event);
  }, [addRecord, getEventById]);
  const handleRecordConfirm = useCallback((eventId: string, data: {
    note?: string;
    extra?: Record<string, unknown>;
  }) => {
    addRecord(eventId, {
      note: data.note,
      extra: data.extra
    });
    const event = getEventById(eventId);
    if (event) {
      setToastEvent(event);
    }
  }, [addRecord, getEventById]);
  const handleCreateEvent = useCallback((data: {
    name: string;
    type: EventType;
    icon: string;
    color: string;
  }) => {
    addEvent(data);
  }, [addEvent]);
  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);
  const selectedDateRecords = getRecordsByDate(selectedDate);
  return <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {activeTab === 'home' && '我的生活'}
            {activeTab === 'calendar' && '查看'}
            {activeTab === 'stats' && '趋势'}
            {activeTab === 'settings' && '设置'}
          </h1>
          {activeTab === 'home'}
          {activeTab === 'calendar' && <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
              <button onClick={() => setCalendarViewMode('calendar')} className={`p-2 rounded-full transition-colors ${calendarViewMode === 'calendar' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                <Calendar className="w-4 h-4" />
              </button>
              <button onClick={() => setCalendarViewMode('timeline')} className={`p-2 rounded-full transition-colors ${calendarViewMode === 'timeline' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-5 py-6">
        {/* Home Tab */}
        {activeTab === 'home' && <>
            {events.length === 0 ? <EmptyState onCreateFirst={() => setCreateSheetOpen(true)} /> : <EventGrid events={events} getLastRecord={getLastRecordForEvent} getTodayRecordCount={getTodayRecordCount} onQuickRecord={handleQuickRecord} onDeleteEvent={deleteEvent} />}
          </>}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && <>
            {calendarViewMode === 'calendar' ? <CalendarView records={records} events={events} onDateSelect={handleDateSelect} selectedDate={selectedDate} /> : <TimelineRecords date={selectedDate} records={records} events={events} showAllDates />}
          </>}

        {/* Stats Tab */}
        {activeTab === 'stats' && <EnhancedStatsView records={records} events={events} />}

        {/* Settings Tab */}
        {activeTab === 'settings' && <Settings />}
      </main>

      {/* Floating Add Button - Only on Home */}
      {activeTab === 'home' && <FloatingAddButton onClick={() => setCreateSheetOpen(true)} />}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Create Event Sheet */}
      <CreateEventSheet open={createSheetOpen} onOpenChange={setCreateSheetOpen} onSubmit={handleCreateEvent} />

      {/* Record Toast */}
      <RecordToast event={toastEvent} onHide={() => setToastEvent(null)} />

      {/* Record Input Sheet for events with attributes */}
      <RecordInputSheet open={recordSheetOpen} onOpenChange={setRecordSheetOpen} event={recordSheetEvent} onConfirm={handleRecordConfirm} />
    </div>;
};
export default Index;