import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export const FloatingAddButton = ({ onClick }: FloatingAddButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed right-6 bottom-24 z-50',
        'w-14 h-14 rounded-full',
        'bg-primary text-primary-foreground',
        'shadow-elevated hover:shadow-lg',
        'flex items-center justify-center',
        'transition-all duration-200',
        'hover:scale-105 active:scale-95'
      )}
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};
