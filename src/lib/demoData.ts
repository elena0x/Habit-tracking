import { format, subDays } from 'date-fns';
import type { Event, EventRecord } from '@/types';
import { getEvents, getRecords, saveEvents, saveRecords } from '@/lib/storage';

const DEMO_EVENTS: Event[] = [
  {
    id: 'demo-morning-walk',
    name: 'Morning walk',
    type: 'daily',
    icon: '🌤️',
    color: 'amber',
    quickRecord: true,
    createdAt: '2025-01-01T08:00:00.000Z',
  },
  {
    id: 'demo-deep-work',
    name: 'Deep work',
    type: 'daily',
    icon: '🎯',
    color: 'violet',
    attributes: [
      { id: 'demo-focus-duration', name: 'Duration', type: 'number', config: { unit: 'min' } },
      { id: 'demo-focus-quality', name: 'Focus', type: 'rating', config: { max: 5 } },
    ],
    createdAt: '2025-01-01T08:01:00.000Z',
  },
  {
    id: 'demo-reading',
    name: 'Reading',
    type: 'daily',
    icon: '📚',
    color: 'emerald',
    attributes: [
      { id: 'demo-reading-pages', name: 'Pages', type: 'number', config: { unit: 'pages' } },
    ],
    createdAt: '2025-01-01T08:02:00.000Z',
  },
  {
    id: 'demo-journal',
    name: 'Evening reflection',
    type: 'log',
    icon: '✨',
    color: 'sky',
    attributes: [
      { id: 'demo-journal-mood', name: 'Mood', type: 'rating', config: { max: 5 } },
    ],
    createdAt: '2025-01-01T08:03:00.000Z',
  },
];

const createDemoRecords = (): EventRecord[] => {
  const today = new Date();
  const records: EventRecord[] = [];

  for (let offset = 0; offset < 42; offset += 1) {
    const date = format(subDays(today, offset), 'yyyy-MM-dd');

    if (offset % 7 !== 2) {
      records.push({
        id: `demo-walk-${offset}`,
        eventId: 'demo-morning-walk',
        date,
        time: '07:30',
        createdAt: `${date}T07:30:00.000Z`,
      });
    }

    if (offset % 3 !== 1) {
      records.push({
        id: `demo-focus-${offset}`,
        eventId: 'demo-deep-work',
        date,
        time: '10:15',
        note: offset === 0 ? 'Finished the portfolio case study.' : undefined,
        extra: { 'demo-focus-duration': 60 + (offset % 3) * 15, 'demo-focus-quality': 4 },
        createdAt: `${date}T10:15:00.000Z`,
      });
    }

    if (offset % 2 === 0) {
      records.push({
        id: `demo-reading-${offset}`,
        eventId: 'demo-reading',
        date,
        time: '20:00',
        extra: { 'demo-reading-pages': 18 + (offset % 5) },
        createdAt: `${date}T20:00:00.000Z`,
      });
    }

    if (offset % 4 === 0) {
      records.push({
        id: `demo-journal-${offset}`,
        eventId: 'demo-journal',
        date,
        time: '21:30',
        note: offset === 0 ? 'A calm, focused day with good momentum.' : undefined,
        extra: { 'demo-journal-mood': 4 + (offset % 8 === 0 ? 1 : 0) },
        createdAt: `${date}T21:30:00.000Z`,
      });
    }
  }

  return records;
};

/** Seeds an opt-in demo without ever overwriting a person's existing habits. */
export const seedDemoData = (): boolean => {
  const isDemoRequested = new URLSearchParams(window.location.search).get('demo') === '1';
  if (!isDemoRequested || getEvents().length > 0 || getRecords().length > 0) return false;

  saveEvents(DEMO_EVENTS);
  saveRecords(createDemoRecords());
  return true;
};
