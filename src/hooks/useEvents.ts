import { useState, useEffect, useCallback } from 'react';
import type { Event } from '@/types';
import * as storage from '@/lib/storage';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(() => {
    const data = storage.getEvents();
    setEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const addEvent = useCallback((event: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...event,
      id: storage.generateId(),
      createdAt: new Date().toISOString(),
    };
    storage.addEvent(newEvent);
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<Event>) => {
    storage.updateEvent(id, updates);
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    storage.deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const getEventById = useCallback((id: string) => {
    return events.find(e => e.id === id);
  }, [events]);

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    refresh: loadEvents,
  };
};
