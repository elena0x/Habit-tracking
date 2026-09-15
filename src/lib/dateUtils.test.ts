import { describe, expect, it } from 'vitest';
import { formatDisplayDate, formatMonth, getMonthDays, isRecordedToday } from '@/lib/dateUtils';

describe('date utilities', () => {
  it('formats dates for the English interface', () => {
    expect(formatDisplayDate('2026-09-14')).toBe('Sep 14');
    expect(formatMonth(new Date(2026, 8, 14))).toBe('September 2026');
  });

  it('returns every calendar day in a month', () => {
    expect(getMonthDays(new Date(2024, 1, 1))).toHaveLength(29);
  });

  it('compares records against the device-local day', () => {
    const today = [
      new Date().getFullYear(),
      String(new Date().getMonth() + 1).padStart(2, '0'),
      String(new Date().getDate()).padStart(2, '0'),
    ].join('-');

    expect(isRecordedToday(today)).toBe(true);
  });
});
