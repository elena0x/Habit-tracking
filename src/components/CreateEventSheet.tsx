import { useState } from 'react';
import { X, Home } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EventTemplates, EVENT_TEMPLATES, type EventTemplate } from './EventTemplates';
import type { EventType } from '@/types';
import { cn } from '@/lib/utils';

interface CreateEventSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; type: EventType; icon: string; color: string }) => void;
}

const EMOJI_OPTIONS = ['📝', '🏃', '📚', '💪', '🎯', '✨', '🌟', '💡', '🎨', '🎵', '☕', '🍎', '💤', '🧘', '✈️', '📷'];

const COLOR_OPTIONS = [
  { name: 'amber', label: '琥珀', class: 'bg-amber-400' },
  { name: 'rose', label: '玫红', class: 'bg-rose-400' },
  { name: 'emerald', label: '翠绿', class: 'bg-emerald-400' },
  { name: 'sky', label: '天蓝', class: 'bg-sky-400' },
  { name: 'violet', label: '紫罗兰', class: 'bg-violet-400' },
  { name: 'orange', label: '橙色', class: 'bg-orange-400' },
];

const TYPE_OPTIONS: { value: EventType; label: string; desc: string }[] = [
  { value: 'daily', label: '日常', desc: '可重复打卡' },
  { value: 'once', label: '一次性', desc: '发生一次的事' },
  { value: 'log', label: '记录', desc: '需要填写内容' },
];

type ViewMode = 'templates' | 'custom';

export const CreateEventSheet = ({ open, onOpenChange, onSubmit }: CreateEventSheetProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('templates');
  const [selectedCategory, setSelectedCategory] = useState('所有');
  const [name, setName] = useState('');
  const [type, setType] = useState<EventType>('daily');
  const [icon, setIcon] = useState('📝');
  const [color, setColor] = useState('sky');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), type, icon, color });
    resetForm();
    onOpenChange(false);
  };

  const handleSelectTemplate = (template: EventTemplate) => {
    onSubmit({ 
      name: template.name, 
      type: template.type, 
      icon: template.icon, 
      color: template.color 
    });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setViewMode('templates');
    setSelectedCategory('所有');
    setName('');
    setType('daily');
    setIcon('📝');
    setColor('sky');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8 pt-6 max-h-[85vh] overflow-y-auto">
        <SheetHeader className="mb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">新建事件</SheetTitle>
            <button 
              onClick={() => handleOpenChange(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          {viewMode === 'templates' && (
            <p className="text-sm text-muted-foreground text-left">
              没有想法？从选取一些预设事件开始吧
            </p>
          )}
        </SheetHeader>

        {viewMode === 'templates' ? (
          <div className="space-y-6">
            <EventTemplates
              onSelectTemplate={handleSelectTemplate}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button 
                onClick={() => setViewMode('custom')}
                className="w-full h-12 rounded-xl text-base font-medium"
              >
                自定义事件
              </Button>
              <button className="w-full text-center text-sm text-muted-foreground py-2">
                从模版导入
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back Button */}
            <button 
              onClick={() => setViewMode('templates')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Home className="w-4 h-4" />
              <span>返回预设</span>
            </button>

            {/* Name Input */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">事件名称</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="比如：跑步、读书、喝咖啡..."
                className="h-12 text-base rounded-xl border-border/50 bg-muted/30"
              />
            </div>

            {/* Icon Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">选择图标</Label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setIcon(emoji)}
                    className={cn(
                      'w-11 h-11 text-xl rounded-xl transition-all',
                      icon === emoji 
                        ? 'bg-primary text-primary-foreground scale-110' 
                        : 'bg-muted/50 hover:bg-muted'
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">选择颜色</Label>
              <div className="flex gap-3">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    className={cn(
                      'w-9 h-9 rounded-full transition-all',
                      c.class,
                      color === c.name 
                        ? 'ring-2 ring-offset-2 ring-foreground/20 scale-110' 
                        : 'opacity-60 hover:opacity-100'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">事件类型</Label>
              <div className="grid grid-cols-3 gap-2">
                {TYPE_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={cn(
                      'p-3 rounded-xl text-left transition-all',
                      type === t.value 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted/50 hover:bg-muted'
                    )}
                  >
                    <div className="font-medium text-sm">{t.label}</div>
                    <div className={cn(
                      'text-xs mt-0.5',
                      type === t.value ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    )}>
                      {t.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit} 
              disabled={!name.trim()}
              className="w-full h-12 rounded-xl text-base font-medium"
            >
              创建事件
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
