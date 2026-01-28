import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Event } from '@/types';

interface RecordToastProps {
  event: Event | null;
  onHide: () => void;
}

export const RecordToast = ({ event, onHide }: RecordToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (event) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onHide, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [event, onHide]);

  if (!event) return null;

  return (
    <div
      className={cn(
        'fixed top-6 left-1/2 -translate-x-1/2 z-50',
        'bg-foreground text-background px-5 py-3 rounded-full',
        'shadow-elevated flex items-center gap-2',
        'transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      )}
    >
      <span className="text-lg">{event.icon}</span>
      <span className="font-medium">已记录 {event.name}</span>
    </div>
  );
};
