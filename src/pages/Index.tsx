import { useState, useCallback } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useRecords } from '@/hooks/useRecords';
import { EventCard } from '@/components/EventCard';
import { CreateEventSheet } from '@/components/CreateEventSheet';
import { CalendarView } from '@/components/CalendarView';
import { DayRecordsList } from '@/components/DayRecordsList';
import { StatsView } from '@/components/StatsView';
import { BottomNav } from '@/components/BottomNav';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { EmptyState } from '@/components/EmptyState';
import { RecordToast } from '@/components/RecordToast';
import type { Event, EventType } from '@/types';
import { getCurrentDate } from '@/lib/dateUtils';

type TabType = 'home' | 'calendar' | 'stats';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [toastEvent, setToastEvent] = useState<Event | null>(null);

  const { events, addEvent, getEventById } = useEvents();
  const { records, addRecord, getLastRecordForEvent, getRecordsByDate } = useRecords();

  const handleQuickRecord = useCallback((eventId: string) => {
    addRecord(eventId);
    const event = getEventById(eventId);
    if (event) {
      setToastEvent(event);
    }
  }, [addRecord, getEventById]);

  const handleCreateEvent = useCallback((data: { name: string; type: EventType; icon: string; color: string }) => {
    addEvent(data);
  }, [addEvent]);

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const selectedDateRecords = getRecordsByDate(selectedDate);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-lg mx-auto px-5 py-4">
          <h1 className="text-xl font-semibold">
            {activeTab === 'home' && '我的生活'}
            {activeTab === 'calendar' && '日历'}
            {activeTab === 'stats' && '趋势'}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-5 py-6">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <>
            {events.length === 0 ? (
              <EmptyState onCreateFirst={() => setCreateSheetOpen(true)} />
            ) : (
              <div className="space-y-3 animate-fade-in">
                {events.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    lastRecord={getLastRecordForEvent(event.id)}
                    onQuickRecord={() => handleQuickRecord(event.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <CalendarView
              records={records}
              events={events}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
            <DayRecordsList
              date={selectedDate}
              records={selectedDateRecords}
              events={events}
            />
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <StatsView records={records} events={events} />
        )}
      </main>

      {/* Floating Add Button - Only on Home */}
      {activeTab === 'home' && (
        <FloatingAddButton onClick={() => setCreateSheetOpen(true)} />
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Create Event Sheet */}
      <CreateEventSheet
        open={createSheetOpen}
        onOpenChange={setCreateSheetOpen}
        onSubmit={handleCreateEvent}
      />

      {/* Record Toast */}
      <RecordToast event={toastEvent} onHide={() => setToastEvent(null)} />
    </div>
  );
};

export default Index;
