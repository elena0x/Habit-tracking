import type { Event, EventRecord } from '@/types';

const EVENTS_KEY = 'lifelogger_events';
const RECORDS_KEY = 'lifelogger_records';
const LEGACY_EVENTS_KEY = 'life-record-events';
const LEGACY_RECORDS_KEY = 'life-record-records';

export interface HabitFlowBackup {
  version: 1;
  events: Event[];
  records: EventRecord[];
  exportedAt: string;
}

const readArray = <T>(key: string): T[] | null => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as T[] : null;
  } catch {
    return null;
  }
};

const readWithLegacyFallback = <T>(key: string, legacyKey: string): T[] => {
  const current = readArray<T>(key);
  if (current) return current;

  const legacy = readArray<T>(legacyKey);
  if (!legacy) return [];

  localStorage.setItem(key, JSON.stringify(legacy));
  return legacy;
};

// Event operations
export const getEvents = (): Event[] => {
  return readWithLegacyFallback<Event>(EVENTS_KEY, LEGACY_EVENTS_KEY);
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
  return readWithLegacyFallback<EventRecord>(RECORDS_KEY, LEGACY_RECORDS_KEY);
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
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

export const exportBackup = (): HabitFlowBackup => ({
  version: 1,
  events: getEvents(),
  records: getRecords(),
  exportedAt: new Date().toISOString(),
});

const isObject = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object';
};

const isEvent = (value: unknown): value is Event => {
  if (!isObject(value)) return false;
  return typeof value.id === 'string'
    && typeof value.name === 'string'
    && ['once', 'daily', 'log'].includes(String(value.type))
    && typeof value.icon === 'string'
    && typeof value.createdAt === 'string'
    && (value.attributes === undefined || Array.isArray(value.attributes));
};

const isEventRecord = (value: unknown): value is EventRecord => {
  if (!isObject(value)) return false;
  return typeof value.id === 'string'
    && typeof value.eventId === 'string'
    && typeof value.date === 'string'
    && typeof value.createdAt === 'string';
};

const isBackup = (value: unknown): value is Omit<HabitFlowBackup, 'version'> & { version?: 1 } => {
  if (!isObject(value)) return false;
  return (value.version === undefined || value.version === 1)
    && Array.isArray(value.events)
    && value.events.every(isEvent)
    && Array.isArray(value.records)
    && value.records.every(isEventRecord);
};

export const importBackup = (value: unknown): void => {
  if (!isBackup(value)) {
    throw new Error('Invalid HabitFlow backup');
  }

  saveEvents(value.events);
  saveRecords(value.records);
};

export const clearAllData = (): void => {
  [EVENTS_KEY, RECORDS_KEY, LEGACY_EVENTS_KEY, LEGACY_RECORDS_KEY].forEach((key) => {
    localStorage.removeItem(key);
  });
};
