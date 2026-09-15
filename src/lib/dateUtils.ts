import { format, formatDistanceToNow, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const formatDisplayDate = (date: string): string => {
  return format(parseISO(date), 'MMM d', { locale: enUS });
};

export const formatRelativeTime = (date: string): string => {
  return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: enUS });
};

export const formatMonth = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: enUS });
};

export const formatYearMonth = (date: Date): string => {
  return format(date, 'yyyy-MM');
};

export const getMonthDays = (date: Date): Date[] => {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
};

export const isSameMonthAs = (date1: Date, date2: Date): boolean => {
  return isSameMonth(date1, date2);
};

export const isTodayDate = (date: Date): boolean => {
  return isToday(date);
};

export const getWeekDays = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

export const getCurrentDate = (): string => {
  return formatDate(new Date());
};

export const getCurrentTime = (): string => {
  return formatTime(new Date());
};

// Use the device's calendar date so a check-in never lands on the wrong day abroad.
export const getLocalDate = (): string => {
  return formatDate(new Date());
};

// Check if a record date matches today in the device's timezone.
export const isRecordedToday = (recordDate: string): boolean => {
  return recordDate === getLocalDate();
};
