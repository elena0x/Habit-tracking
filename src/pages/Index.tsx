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
import { NoteInputDialog } from '@/components/NoteInputDialog';
import Settings from '@/pages/Settings';
import type { Event, EventType } from '@/types';
import { getCurrentDate } from '@/lib/dateUtils';
import { Search, Bell, Plus } from 'lucide-react';

type TabType = 'home' | 'calendar' | 'stats' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [toastEvent, setToastEvent] = useState<Event | null>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteDialogEvent, setNoteDialogEvent] = useState<Event | null>(null);

  const { events, addEvent, deleteEvent, getEventById } = useEvents();
  const { records, addRecord, getLastRecordForEvent, getRecordsByDate } = useRecords();

  const handleQuickRecord = useCallback((eventId: string) => {
    const event = getEventById(eventId);
    if (!event) return;
    
    // For log type events, show note input dialog
    if (event.type === 'log') {
      setNoteDialogEvent(event);
      setNoteDialogOpen(true);
      return;
    }
    
    // For other types, record immediately
    addRecord(eventId);
    setToastEvent(event);
  }, [addRecord, getEventById]);

  const handleNoteConfirm = useCallback((eventId: string, note: string) => {
    addRecord(eventId, { note: note || undefined });
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
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {activeTab === 'home' && '我的生活'}
            {activeTab === 'calendar' && '查看'}
            {activeTab === 'stats' && '趋势'}
            {activeTab === 'settings' && '设置'}
          </h1>
          {activeTab === 'home' && (
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted">
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button>
              <button 
                onClick={() => setCreateSheetOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted"
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          )}
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
              <EventGrid
                events={events}
                getLastRecord={getLastRecordForEvent}
                onQuickRecord={handleQuickRecord}
                onDeleteEvent={deleteEvent}
              />
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
            <TimelineRecords
              date={selectedDate}
              records={selectedDateRecords}
              events={events}
            />
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <EnhancedStatsView records={records} events={events} />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Settings />
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

      {/* Note Input Dialog for log type events */}
      <NoteInputDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        event={noteDialogEvent}
        onConfirm={handleNoteConfirm}
      />
    </div>
  );
};

export default Index;
