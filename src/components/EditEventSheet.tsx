import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Event, EventType } from '@/types';
import { cn } from '@/lib/utils';

interface EditEventSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onSubmit: (id: string, data: { name: string; type: EventType; icon: string; color: string }) => void;
}

const EMOJI_OPTIONS = ['📝', '🏃', '📚', '💪', '🎯', '✨', '🌟', '💡', '🎨', '🎵', '☕', '🍎', '💤', '🧘', '✈️', '📷'];

const COLOR_OPTIONS = [
  { name: 'amber', label: '琥珀', class: 'bg-amber-400', hex: '#fbbf24' },
  { name: 'rose', label: '玫红', class: 'bg-rose-400', hex: '#fb7185' },
  { name: 'emerald', label: '翠绿', class: 'bg-emerald-400', hex: '#34d399' },
  { name: 'sky', label: '天蓝', class: 'bg-sky-400', hex: '#38bdf8' },
  { name: 'violet', label: '紫罗兰', class: 'bg-violet-400', hex: '#a78bfa' },
  { name: 'orange', label: '橙色', class: 'bg-orange-400', hex: '#fb923c' },
];

const TYPE_OPTIONS: { value: EventType; label: string; desc: string }[] = [
  { value: 'daily', label: '日常', desc: '可重复打卡' },
  { value: 'once', label: '一次性', desc: '发生一次的事' },
  { value: 'log', label: '记录', desc: '需要填写内容' },
];

export const EditEventSheet = ({ open, onOpenChange, event, onSubmit }: EditEventSheetProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<EventType>('daily');
  const [icon, setIcon] = useState('📝');
  const [color, setColor] = useState('sky');

  // Initialize form with event data when opened
  useEffect(() => {
    if (open && event) {
      setName(event.name);
      setType(event.type);
      setIcon(event.icon);
      setColor(event.color || 'sky');
    }
  }, [open, event]);

  const handleSubmit = () => {
    if (!name.trim() || !event) return;
    onSubmit(event.id, { name: name.trim(), type, icon, color });
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  if (!event) return null;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8 pt-6 max-h-[85vh] overflow-y-auto">
        <SheetHeader className="mb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">编辑事件</SheetTitle>
            <button 
              onClick={() => handleOpenChange(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">事件名称</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 50))}
              placeholder="比如：跑步、读书、喝咖啡..."
              className="h-12 text-base rounded-xl border-border/50 bg-muted/30"
              maxLength={50}
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
            {/* Custom Emoji Input */}
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={icon}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    const chars = [...value];
                    setIcon(chars[chars.length - 1]);
                  }
                }}
                placeholder="或输入自定义 emoji"
                className="h-10 text-center text-xl rounded-xl border-border/50 bg-muted/30 w-20"
                maxLength={4}
              />
              <span className="text-xs text-muted-foreground">输入任意 emoji</span>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">选择颜色</Label>
            <div className="flex items-center gap-3">
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
              {/* Custom Color Picker */}
              <div className="relative">
                <input
                  type="color"
                  value={color.startsWith('#') ? color : COLOR_OPTIONS.find(c => c.name === color)?.hex || '#38bdf8'}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-9 h-9 rounded-full cursor-pointer border-0 p-0 overflow-hidden"
                  style={{ 
                    appearance: 'none',
                    WebkitAppearance: 'none',
                  }}
                />
                {color.startsWith('#') && (
                  <div 
                    className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-foreground/20 pointer-events-none"
                    style={{ backgroundColor: color }}
                  />
                )}
              </div>
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
            保存修改
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
