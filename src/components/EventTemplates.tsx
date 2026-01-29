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

export const EVENT_TEMPLATES: EventTemplate[] = [
  // 日常
  { 
    id: 't1', 
    name: '一次性', 
    icon: '🏔️', 
    color: 'violet', 
    type: 'once', 
    category: '日常',
    attributes: [
      { id: 'attr-t1-1', name: '备注', type: 'text' }
    ]
  },
  { 
    id: 't2', 
    name: '记账', 
    icon: '💰', 
    color: 'emerald', 
    type: 'log', 
    category: '日常',
    attributes: [
      { id: 'attr-t2-1', name: '金额', type: 'number', config: { unit: '元' } },
      { id: 'attr-t2-2', name: '类别', type: 'single_select', config: { options: ['餐饮', '交通', '购物', '娱乐', '其他'] } },
      { id: 'attr-t2-3', name: '备注', type: 'text' }
    ]
  },
  { 
    id: 't3', 
    name: '日记', 
    icon: '📖', 
    color: 'sky', 
    type: 'log', 
    category: '日常',
    attributes: [
      { id: 'attr-t3-1', name: '心情', type: 'rating', config: { max: 5 } },
      { id: 'attr-t3-2', name: '内容', type: 'text' }
    ]
  },
  { 
    id: 't4', 
    name: '订阅管理', 
    icon: '📱', 
    color: 'violet', 
    type: 'log', 
    category: '日常',
    attributes: [
      { id: 'attr-t4-1', name: '订阅名称', type: 'text' },
      { id: 'attr-t4-2', name: '月费', type: 'number', config: { unit: '元' } },
      { id: 'attr-t4-3', name: '自动续费', type: 'toggle' }
    ]
  },
  
  // 健康
  { 
    id: 't5', 
    name: '无氧训练', 
    icon: '🏋️', 
    color: 'orange', 
    type: 'daily', 
    category: '健康',
    attributes: [
      { id: 'attr-t5-1', name: '训练时长', type: 'number', config: { unit: '分钟' } },
      { id: 'attr-t5-2', name: '训练部位', type: 'multi_select', config: { options: ['胸', '背', '腿', '肩', '手臂', '核心'] } },
      { id: 'attr-t5-3', name: '强度', type: 'rating', config: { max: 5 } }
    ]
  },
  { 
    id: 't6', 
    name: '有氧训练', 
    icon: '🏃', 
    color: 'rose', 
    type: 'daily', 
    category: '健康',
    attributes: [
      { id: 'attr-t6-1', name: '运动时长', type: 'number', config: { unit: '分钟' } },
      { id: 'attr-t6-2', name: '距离', type: 'number', config: { unit: '公里' } },
      { id: 'attr-t6-3', name: '类型', type: 'single_select', config: { options: ['跑步', '快走', '椭圆机', '划船机', '跳绳'] } }
    ]
  },
  { 
    id: 't7', 
    name: '喝水', 
    icon: '💧', 
    color: 'sky', 
    type: 'daily', 
    category: '健康',
    attributes: [
      { id: 'attr-t7-1', name: '饮水量', type: 'number', config: { unit: '毫升' } }
    ]
  },
  { 
    id: 't8', 
    name: '睡眠', 
    icon: '😴', 
    color: 'violet', 
    type: 'log', 
    category: '健康',
    attributes: [
      { id: 'attr-t8-1', name: '入睡时间', type: 'time' },
      { id: 'attr-t8-2', name: '起床时间', type: 'time' },
      { id: 'attr-t8-3', name: '睡眠质量', type: 'rating', config: { max: 5 } }
    ]
  },
  { 
    id: 't9', 
    name: '体重', 
    icon: '⚖️', 
    color: 'amber', 
    type: 'log', 
    category: '健康',
    attributes: [
      { id: 'attr-t9-1', name: '体重', type: 'number', config: { unit: '公斤' } },
      { id: 'attr-t9-2', name: '体脂率', type: 'number', config: { unit: '%' } }
    ]
  },
  
  // 学习
  { 
    id: 't10', 
    name: '学习', 
    icon: '📚', 
    color: 'sky', 
    type: 'daily', 
    category: '学习',
    attributes: [
      { id: 'attr-t10-1', name: '学习时长', type: 'number', config: { unit: '分钟' } },
      { id: 'attr-t10-2', name: '科目', type: 'text' },
      { id: 'attr-t10-3', name: '专注度', type: 'rating', config: { max: 5 } }
    ]
  },
  { 
    id: 't11', 
    name: '英语', 
    icon: '🔤', 
    color: 'emerald', 
    type: 'daily', 
    category: '学习',
    attributes: [
      { id: 'attr-t11-1', name: '学习时长', type: 'number', config: { unit: '分钟' } },
      { id: 'attr-t11-2', name: '类型', type: 'single_select', config: { options: ['听力', '口语', '阅读', '写作', '单词'] } },
      { id: 'attr-t11-3', name: '新单词数', type: 'number' }
    ]
  },
  { 
    id: 't12', 
    name: '阅读', 
    icon: '📕', 
    color: 'rose', 
    type: 'daily', 
    category: '学习',
    attributes: [
      { id: 'attr-t12-1', name: '阅读时长', type: 'number', config: { unit: '分钟' } },
      { id: 'attr-t12-2', name: '书名', type: 'text' },
      { id: 'attr-t12-3', name: '页数', type: 'number', config: { unit: '页' } }
    ]
  },
  
  // 生活
  { 
    id: 't13', 
    name: '购物', 
    icon: '🛒', 
    color: 'orange', 
    type: 'log', 
    category: '生活',
    attributes: [
      { id: 'attr-t13-1', name: '商品', type: 'text' },
      { id: 'attr-t13-2', name: '金额', type: 'number', config: { unit: '元' } },
      { id: 'attr-t13-3', name: '平台', type: 'single_select', config: { options: ['淘宝', '京东', '拼多多', '线下', '其他'] } }
    ]
  },
  { 
    id: 't14', 
    name: '电影', 
    icon: '🎬', 
    color: 'violet', 
    type: 'log', 
    category: '生活',
    attributes: [
      { id: 'attr-t14-1', name: '电影名', type: 'text' },
      { id: 'attr-t14-2', name: '评分', type: 'rating', config: { max: 5 } },
      { id: 'attr-t14-3', name: '观看方式', type: 'single_select', config: { options: ['影院', '在线', '电视'] } }
    ]
  },
  { 
    id: 't15', 
    name: '旅行', 
    icon: '✈️', 
    color: 'sky', 
    type: 'once', 
    category: '生活',
    attributes: [
      { id: 'attr-t15-1', name: '目的地', type: 'text' },
      { id: 'attr-t15-2', name: '天数', type: 'number', config: { unit: '天' } },
      { id: 'attr-t15-3', name: '花费', type: 'number', config: { unit: '元' } }
    ]
  },
  
  // 运动
  { 
    id: 't16', 
    name: '滑雪', 
    icon: '⛷️', 
    color: 'sky', 
    type: 'once', 
    category: '运动',
    attributes: [
      { id: 'attr-t16-1', name: '雪场', type: 'text' },
      { id: 'attr-t16-2', name: '时长', type: 'number', config: { unit: '小时' } },
      { id: 'attr-t16-3', name: '体验评分', type: 'rating', config: { max: 5 } }
    ]
  },
  { 
    id: 't17', 
    name: '游泳', 
    icon: '🏊', 
    color: 'sky', 
    type: 'daily', 
    category: '运动',
    attributes: [
      { id: 'attr-t17-1', name: '游泳时长', type: 'number', config: { unit: '分钟' } },
      { id: 'attr-t17-2', name: '距离', type: 'number', config: { unit: '米' } },
      { id: 'attr-t17-3', name: '泳姿', type: 'multi_select', config: { options: ['自由泳', '蛙泳', '仰泳', '蝶泳'] } }
    ]
  },
  { 
    id: 't18', 
    name: '骑行', 
    icon: '🚴', 
    color: 'emerald', 
    type: 'daily', 
    category: '运动',
    attributes: [
      { id: 'attr-t18-1', name: '骑行时长', type: 'number', config: { unit: '分钟' } },
      { id: 'attr-t18-2', name: '距离', type: 'number', config: { unit: '公里' } },
      { id: 'attr-t18-3', name: '路线', type: 'text' }
    ]
  },
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
            <div className="flex-1 text-left">
              <span className="font-medium">{template.name}</span>
              {template.attributes && template.attributes.length > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {template.attributes.map(a => a.name).join('、')}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
