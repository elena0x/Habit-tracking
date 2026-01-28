import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export interface EventTemplate {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'once' | 'daily' | 'log';
  category: string;
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  // 日常
  { id: 't1', name: '一次性', icon: '🏔️', color: 'violet', type: 'once', category: '日常' },
  { id: 't2', name: '记账', icon: '💰', color: 'emerald', type: 'log', category: '日常' },
  { id: 't3', name: '日记', icon: '📖', color: 'sky', type: 'log', category: '日常' },
  { id: 't4', name: '订阅管理', icon: '📱', color: 'violet', type: 'log', category: '日常' },
  
  // 健康
  { id: 't5', name: '无氧训练', icon: '🏋️', color: 'orange', type: 'daily', category: '健康' },
  { id: 't6', name: '有氧训练', icon: '🏃', color: 'rose', type: 'daily', category: '健康' },
  { id: 't7', name: '喝水', icon: '💧', color: 'sky', type: 'daily', category: '健康' },
  { id: 't8', name: '睡眠', icon: '😴', color: 'violet', type: 'log', category: '健康' },
  { id: 't9', name: '体重', icon: '⚖️', color: 'amber', type: 'log', category: '健康' },
  
  // 学习
  { id: 't10', name: '学习', icon: '📚', color: 'sky', type: 'daily', category: '学习' },
  { id: 't11', name: '英语', icon: '🔤', color: 'emerald', type: 'daily', category: '学习' },
  { id: 't12', name: '阅读', icon: '📕', color: 'rose', type: 'daily', category: '学习' },
  
  // 生活
  { id: 't13', name: '购物', icon: '🛒', color: 'orange', type: 'log', category: '生活' },
  { id: 't14', name: '电影', icon: '🎬', color: 'violet', type: 'log', category: '生活' },
  { id: 't15', name: '旅行', icon: '✈️', color: 'sky', type: 'once', category: '生活' },
  
  // 运动
  { id: 't16', name: '滑雪', icon: '⛷️', color: 'sky', type: 'once', category: '运动' },
  { id: 't17', name: '游泳', icon: '🏊', color: 'sky', type: 'daily', category: '运动' },
  { id: 't18', name: '骑行', icon: '🚴', color: 'emerald', type: 'daily', category: '运动' },
];

const CATEGORIES = ['所有', '日常', '健康', '学习', '生活', '运动'];

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
  const filteredTemplates = selectedCategory === '所有' 
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
            <span className="font-medium">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
