// Event types
export type EventType = 'once' | 'daily' | 'log';

// Attribute types for custom event fields
export type AttributeType = 'number' | 'single_select' | 'multi_select' | 'text' | 'toggle' | 'rating' | 'time';

export interface SelectOption {
  id: string;
  label: string;
}

export interface AttributeConfig {
  unit?: string; // For number type (e.g., 'min', 'kg')
  max?: number; // For rating type
  options?: string[]; // For single_select and multi_select
}

export interface EventAttribute {
  id: string;
  name: string;
  type: AttributeType;
  config?: AttributeConfig; // Type-specific configuration
  options?: SelectOption[]; // Legacy: For single_select and multi_select
  required?: boolean;
}

export interface Event {
  id: string;
  name: string;
  type: EventType;
  icon: string;
  color?: string;
  quickRecord?: boolean; // Enable quick record mode (click icon to record immediately)
  attributes?: EventAttribute[]; // Custom attributes for this event
  createdAt: string;
}

export interface EventRecord {
  id: string;
  eventId: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  note?: string;
  extra?: { [key: string]: unknown }; // Store attribute values
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
