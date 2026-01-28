// Event types
export type EventType = 'once' | 'daily' | 'log';

export interface Event {
  id: string;
  name: string;
  type: EventType;
  icon: string;
  color?: string;
  createdAt: string;
}

export interface EventRecord {
  id: string;
  eventId: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  note?: string;
  extra?: { [key: string]: unknown };
  createdAt: string;
}

// UI state types
export interface DayRecords {
  date: string;
  records: EventRecord[];
}

export interface EventStats {
  eventId: string;
  totalRecords: number;
  lastRecordDate?: string;
}

export interface MonthStats {
  month: string; // YYYY-MM
  recordsByEvent: { [eventId: string]: number };
  totalRecords: number;
  activeDays: number;
}

export interface MonthStats {
  month: string; // YYYY-MM
  recordsByEvent: { [eventId: string]: number };
  totalRecords: number;
  activeDays: number;
}
