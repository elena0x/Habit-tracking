import { useState, useEffect, useCallback } from 'react';
import type { EventRecord } from '@/types';
import * as storage from '@/lib/storage';
import { getCurrentDate, getCurrentTime, getBeijingDate } from '@/lib/dateUtils';

export const useRecords = () => {
  const [records, setRecords] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(() => {
    const data = storage.getRecords();
    setRecords(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const addRecord = useCallback((eventId: string, options?: { 
    date?: string; 
    time?: string; 
    note?: string;
    extra?: Record<string, unknown>;
  }) => {
    const newRecord: EventRecord = {
      id: storage.generateId(),
      eventId,
      date: options?.date || getCurrentDate(),
      time: options?.time || getCurrentTime(),
      note: options?.note,
      extra: options?.extra,
      createdAt: new Date().toISOString(),
    };
    storage.addRecord(newRecord);
    setRecords(prev => [...prev, newRecord]);
    return newRecord;
  }, []);

  const deleteRecord = useCallback((id: string) => {
    storage.deleteRecord(id);
    setRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  const getRecordsByEvent = useCallback((eventId: string) => {
    return records.filter(r => r.eventId === eventId);
  }, [records]);

  const getRecordsByDate = useCallback((date: string) => {
    return records.filter(r => r.date === date);
  }, [records]);

  const getRecordsByMonth = useCallback((yearMonth: string) => {
    return records.filter(r => r.date.startsWith(yearMonth));
  }, [records]);

  const getLastRecordForEvent = useCallback((eventId: string) => {
    const eventRecords = records.filter(r => r.eventId === eventId);
    if (eventRecords.length === 0) return null;
    return eventRecords.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [records]);

  const getDatesWithRecords = useCallback((yearMonth: string) => {
    const monthRecords = records.filter(r => r.date.startsWith(yearMonth));
    return [...new Set(monthRecords.map(r => r.date))];
  }, [records]);

  const getTodayRecordCount = useCallback((eventId: string) => {
    const today = getBeijingDate();
    return records.filter(r => r.eventId === eventId && r.date === today).length;
  }, [records]);

  return {
    records,
    loading,
    addRecord,
    deleteRecord,
    getRecordsByEvent,
    getRecordsByDate,
    getRecordsByMonth,
    getLastRecordForEvent,
    getDatesWithRecords,
    getTodayRecordCount,
    refresh: loadRecords,
  };
};
