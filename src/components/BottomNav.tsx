import { Home, Calendar, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'home' | 'calendar' | 'stats';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'home' as TabType, label: '首页', icon: Home },
  { id: 'calendar' as TabType, label: '日历', icon: Calendar },
  { id: 'stats' as TabType, label: '趋势', icon: BarChart3 },
];

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/50 px-4 pb-safe">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5px]')} />
              <span className={cn('text-xs', isActive && 'font-medium')}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
