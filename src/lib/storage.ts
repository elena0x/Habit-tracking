import type { Event, EventRecord } from '@/types';

const EVENTS_KEY = 'lifelogger_events';
const RECORDS_KEY = 'lifelogger_records';

// Event operations
export const getEvents = (): Event[] => {
  const data = localStorage.getItem(EVENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEvents = (events: Event[]): void => {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

export const addEvent = (event: Event): void => {
  const events = getEvents();
  events.push(event);
  saveEvents(events);
};

export const updateEvent = (id: string, updates: Partial<Event>): void => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    saveEvents(events);
  }
};

export const deleteEvent = (id: string): void => {
  const events = getEvents().filter(e => e.id !== id);
  saveEvents(events);
  // Also delete all records for this event
  const records = getRecords().filter(r => r.eventId !== id);
  saveRecords(records);
};

// Record operations
export const getRecords = (): EventRecord[] => {
  const data = localStorage.getItem(RECORDS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRecords = (records: EventRecord[]): void => {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
};

export const addRecord = (record: EventRecord): void => {
  const records = getRecords();
  records.push(record);
  saveRecords(records);
};

export const deleteRecord = (id: string): void => {
  const records = getRecords().filter(r => r.id !== id);
  saveRecords(records);
};

export const getRecordsByEvent = (eventId: string): EventRecord[] => {
  return getRecords().filter(r => r.eventId === eventId);
};

export const getRecordsByDate = (date: string): EventRecord[] => {
  return getRecords().filter(r => r.date === date);
};

export const getRecordsByMonth = (yearMonth: string): EventRecord[] => {
  return getRecords().filter(r => r.date.startsWith(yearMonth));
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
