import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { EventAttribute } from '@/types';

export interface EventTemplate {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'once' | 'daily' | 'log';
  category: string;
  attributes?: EventAttribute[];
}

// eslint-disable-next-line react-refresh/only-export-components -- presets are shared with the creation flow
export const EVENT_TEMPLATES: EventTemplate[] = [
  // Everyday
  { 
    id: 't1', 
    name: 'Milestone',
    icon: '🏔️', 
    color: 'violet', 
    type: 'once', 
    category: 'Everyday',
    attributes: [
      { id: 'attr-t1-1', name: 'Note', type: 'text' }
    ]
  },
  { 
    id: 't2', 
    name: 'Expense',
    icon: '💰', 
    color: 'emerald', 
    type: 'log', 
    category: 'Everyday',
    attributes: [
      { id: 'attr-t2-1', name: 'Amount', type: 'number', config: { unit: '$' } },
      { id: 'attr-t2-2', name: 'Category', type: 'single_select', config: { options: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Other'] } },
      { id: 'attr-t2-3', name: 'Note', type: 'text' }
    ]
  },
  { 
    id: 't3', 
    name: 'Journal',
    icon: '📖', 
    color: 'sky', 
    type: 'log', 
    category: 'Everyday',
    attributes: [
      { id: 'attr-t3-1', name: 'Mood', type: 'rating', config: { max: 5 } },
      { id: 'attr-t3-2', name: 'Entry', type: 'text' }
    ]
  },
  { 
    id: 't4', 
    name: 'Subscription',
    icon: '📱', 
    color: 'violet', 
    type: 'log', 
    category: 'Everyday',
    attributes: [
      { id: 'attr-t4-1', name: 'Service', type: 'text' },
      { id: 'attr-t4-2', name: 'Monthly cost', type: 'number', config: { unit: '$' } },
      { id: 'attr-t4-3', name: 'Auto-renew', type: 'toggle' }
    ]
  },
  
  // Health
  { 
    id: 't5', 
    name: 'Strength training',
    icon: '🏋️', 
    color: 'orange', 
    type: 'daily', 
    category: 'Health',
    attributes: [
      { id: 'attr-t5-1', name: 'Duration', type: 'number', config: { unit: 'min' } },
      { id: 'attr-t5-2', name: 'Focus', type: 'multi_select', config: { options: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'] } },
      { id: 'attr-t5-3', name: 'Intensity', type: 'rating', config: { max: 5 } }
    ]
  },
  { 
    id: 't6', 
    name: 'Cardio',
    icon: '🏃', 
    color: 'rose', 
    type: 'daily', 
    category: 'Health',
    attributes: [
      { id: 'attr-t6-1', name: 'Duration', type: 'number', config: { unit: 'min' } },
      { id: 'attr-t6-2', name: 'Distance', type: 'number', config: { unit: 'km' } },
      { id: 'attr-t6-3', name: 'Activity', type: 'single_select', config: { options: ['Run', 'Walk', 'Elliptical', 'Rowing', 'Jump rope'] } }
    ]
  },
  { 
    id: 't7', 
    name: 'Hydration',
    icon: '💧', 
    color: 'sky', 
    type: 'daily', 
    category: 'Health',
    attributes: [
      { id: 'attr-t7-1', name: 'Volume', type: 'number', config: { unit: 'ml' } }
    ]
  },
  { 
    id: 't8', 
    name: 'Sleep',
    icon: '😴', 
    color: 'violet', 
    type: 'log', 
    category: 'Health',
    attributes: [
      { id: 'attr-t8-1', name: 'Bedtime', type: 'time' },
      { id: 'attr-t8-2', name: 'Wake time', type: 'time' },
      { id: 'attr-t8-3', name: 'Sleep quality', type: 'rating', config: { max: 5 } }
    ]
  },
  { 
    id: 't9', 
    name: 'Weight',
    icon: '⚖️', 
    color: 'amber', 
    type: 'log', 
    category: 'Health',
    attributes: [
      { id: 'attr-t9-1', name: 'Weight', type: 'number', config: { unit: 'kg' } },
      { id: 'attr-t9-2', name: 'Body fat', type: 'number', config: { unit: '%' } }
    ]
  },
  
  // Learning
  { 
    id: 't10', 
    name: 'Study session',
    icon: '📚', 
    color: 'sky', 
    type: 'daily', 
    category: 'Learning',
    attributes: [
      { id: 'attr-t10-1', name: 'Duration', type: 'number', config: { unit: 'min' } },
      { id: 'attr-t10-2', name: 'Subject', type: 'text' },
      { id: 'attr-t10-3', name: 'Focus', type: 'rating', config: { max: 5 } }
    ]
  },
  { 
    id: 't11', 
    name: 'Language practice',
    icon: '🔤', 
    color: 'emerald', 
    type: 'daily', 
    category: 'Learning',
    attributes: [
      { id: 'attr-t11-1', name: 'Duration', type: 'number', config: { unit: 'min' } },
      { id: 'attr-t11-2', name: 'Practice', type: 'single_select', config: { options: ['Listening', 'Speaking', 'Reading', 'Writing', 'Vocabulary'] } },
      { id: 'attr-t11-3', name: 'New words', type: 'number' }
    ]
  },
  { 
    id: 't12', 
    name: 'Reading',
    icon: '📕', 
    color: 'rose', 
    type: 'daily', 
    category: 'Learning',
    attributes: [
      { id: 'attr-t12-1', name: 'Duration', type: 'number', config: { unit: 'min' } },
      { id: 'attr-t12-2', name: 'Book', type: 'text' },
      { id: 'attr-t12-3', name: 'Pages', type: 'number', config: { unit: 'pages' } }
    ]
  },
  
  // Lifestyle
  { 
    id: 't13', 
    name: 'Purchase',
    icon: '🛒', 
    color: 'orange', 
    type: 'log', 
    category: 'Lifestyle',
    attributes: [
      { id: 'attr-t13-1', name: 'Item', type: 'text' },
      { id: 'attr-t13-2', name: 'Amount', type: 'number', config: { unit: '$' } },
      { id: 'attr-t13-3', name: 'Channel', type: 'single_select', config: { options: ['Online store', 'Marketplace', 'In store', 'Other'] } }
    ]
  },
  { 
    id: 't14', 
    name: 'Movie',
    icon: '🎬', 
    color: 'violet', 
    type: 'log', 
    category: 'Lifestyle',
    attributes: [
      { id: 'attr-t14-1', name: 'Title', type: 'text' },
      { id: 'attr-t14-2', name: 'Rating', type: 'rating', config: { max: 5 } },
      { id: 'attr-t14-3', name: 'Watched at', type: 'single_select', config: { options: ['Cinema', 'Streaming', 'TV'] } }
    ]
  },
  { 
    id: 't15', 
    name: 'Trip',
    icon: '✈️', 
    color: 'sky', 
    type: 'once', 
    category: 'Lifestyle',
    attributes: [
      { id: 'attr-t15-1', name: 'Destination', type: 'text' },
      { id: 'attr-t15-2', name: 'Duration', type: 'number', config: { unit: 'days' } },
      { id: 'attr-t15-3', name: 'Cost', type: 'number', config: { unit: '$' } }
    ]
  },
  
  // Fitness
  { 
    id: 't16', 
    name: 'Skiing',
    icon: '⛷️', 
    color: 'sky', 
    type: 'once', 
    category: 'Fitness',
    attributes: [
      { id: 'attr-t16-1', name: 'Resort', type: 'text' },
      { id: 'attr-t16-2', name: 'Duration', type: 'number', config: { unit: 'hours' } },
      { id: 'attr-t16-3', name: 'Experience', type: 'rating', config: { max: 5 } }
    ]
  },
  { 
    id: 't17', 
    name: 'Swimming',
    icon: '🏊', 
    color: 'sky', 
    type: 'daily', 
    category: 'Fitness',
    attributes: [
      { id: 'attr-t17-1', name: 'Duration', type: 'number', config: { unit: 'min' } },
      { id: 'attr-t17-2', name: 'Distance', type: 'number', config: { unit: 'm' } },
      { id: 'attr-t17-3', name: 'Stroke', type: 'multi_select', config: { options: ['Freestyle', 'Breaststroke', 'Backstroke', 'Butterfly'] } }
    ]
  },
  { 
    id: 't18', 
    name: 'Cycling',
    icon: '🚴', 
    color: 'emerald', 
    type: 'daily', 
    category: 'Fitness',
    attributes: [
      { id: 'attr-t18-1', name: 'Duration', type: 'number', config: { unit: 'min' } },
      { id: 'attr-t18-2', name: 'Distance', type: 'number', config: { unit: 'km' } },
      { id: 'attr-t18-3', name: 'Route', type: 'text' }
    ]
  },
];

const CATEGORIES = ['All', 'Everyday', 'Health', 'Learning', 'Lifestyle', 'Fitness'];

interface EventTemplatesProps {
  onSelectTemplate: (template: EventTemplate) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const EventTemplates = ({ 
  onSelectTemplate, 
  selectedCategory, 
  onCategoryChange 
}: EventTemplatesProps) => {
  const filteredTemplates = selectedCategory === 'All'
    ? EVENT_TEMPLATES 
    : EVENT_TEMPLATES.filter(t => t.category === selectedCategory);

  const iconBgClasses: { [key: string]: string } = {
    amber: 'bg-amber-100',
    rose: 'bg-rose-100',
    emerald: 'bg-emerald-100',
    sky: 'bg-sky-100',
    violet: 'bg-violet-100',
    orange: 'bg-orange-100',
  };

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                'whitespace-nowrap flex-shrink-0',
                selectedCategory === category
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {category}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Template List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {filteredTemplates.map(template => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              iconBgClasses[template.color] || iconBgClasses.sky
            )}>
              <span className="text-xl">{template.icon}</span>
            </div>
            <div className="flex-1 text-left">
              <span className="font-medium">{template.name}</span>
              {template.attributes && template.attributes.length > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {template.attributes.map(a => a.name).join(' · ')}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
