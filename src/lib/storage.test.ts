import { beforeEach, describe, expect, it } from 'vitest';
import type { Event, EventRecord } from '@/types';
import {
  clearAllData,
  exportBackup,
  getEvents,
  getRecords,
  importBackup,
  saveEvents,
  saveRecords,
} from '@/lib/storage';

const event: Event = {
  id: 'reading',
  name: 'Reading',
  type: 'daily',
  icon: '📚',
  createdAt: '2026-01-01T09:00:00.000Z',
};

const record: EventRecord = {
  id: 'reading-1',
  eventId: event.id,
  date: '2026-01-02',
  time: '20:00',
  createdAt: '2026-01-02T20:00:00.000Z',
};

describe('local storage', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips events and records through a versioned backup', () => {
    saveEvents([event]);
    saveRecords([record]);

    const backup = exportBackup();
    clearAllData();
    importBackup(backup);

    expect(backup.version).toBe(1);
    expect(getEvents()).toEqual([event]);
    expect(getRecords()).toEqual([record]);
  });

  it('accepts legacy backups that predate the version field', () => {
    importBackup({ events: [event], records: [record], exportedAt: '2026-01-02T20:00:00.000Z' });

    expect(getEvents()).toEqual([event]);
    expect(getRecords()).toEqual([record]);
  });

  it('rejects malformed backups without replacing existing data', () => {
    saveEvents([event]);

    expect(() => importBackup({ events: 'not-an-array', records: [] })).toThrow('Invalid HabitFlow backup');
    expect(getEvents()).toEqual([event]);
  });

  it('rejects unsupported backup versions', () => {
    expect(() => importBackup({ version: 2, events: [event], records: [record] })).toThrow('Invalid HabitFlow backup');
  });

  it('migrates data written under the previous storage keys', () => {
    localStorage.setItem('life-record-events', JSON.stringify([event]));
    localStorage.setItem('life-record-records', JSON.stringify([record]));

    expect(getEvents()).toEqual([event]);
    expect(getRecords()).toEqual([record]);
    expect(localStorage.getItem('lifelogger_events')).not.toBeNull();
  });
});
