import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export const FloatingAddButton = ({ onClick }: FloatingAddButtonProps) => {
  const haptics = useHaptics();

  const handleClick = () => {
    haptics.mediumTap();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'fixed right-5 z-50',
        'w-14 h-14 rounded-full',
        'bg-primary text-primary-foreground',
        'shadow-elevated hover:shadow-lg',
        'flex items-center justify-center',
        'transition-all duration-200',
        'active:scale-95'
      )}
      style={{ bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};
