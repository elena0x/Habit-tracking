import { format, formatDistanceToNow, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const formatDisplayDate = (date: string): string => {
  return format(parseISO(date), 'M月d日', { locale: zhCN });
};

export const formatRelativeTime = (date: string): string => {
  return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: zhCN });
};

export const formatMonth = (date: Date): string => {
  return format(date, 'yyyy年M月', { locale: zhCN });
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
  return ['日', '一', '二', '三', '四', '五', '六'];
};

export const getCurrentDate = (): string => {
  return formatDate(new Date());
};

export const getCurrentTime = (): string => {
  return formatTime(new Date());
};
