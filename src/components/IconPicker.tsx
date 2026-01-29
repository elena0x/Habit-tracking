import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getColorClasses, hexToRgba } from '@/lib/colorUtils';

interface IconPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: string;
  color: string;
  onIconChange: (icon: string) => void;
  onColorChange: (color: string) => void;
}

const EMOJI_CATEGORIES = [
  {
    name: '常用',
    emojis: ['📝', '🏃', '📚', '💪', '🎯', '✨', '🌟', '💡', '🎨', '🎵', '☕', '🍎', '💤', '🧘', '✈️', '📷'],
  },
  {
    name: '运动',
    emojis: ['🏃', '🚴', '🏊', '⚽', '🏀', '🎾', '🏓', '🧗', '🎿', '🏋️', '🤸', '🚶'],
  },
  {
    name: '生活',
    emojis: ['☕', '🍎', '🥗', '💊', '💤', '🧘', '🛁', '🪥', '💇', '👔', '🧹', '🛒'],
  },
  {
    name: '工作',
    emojis: ['💻', '📊', '📧', '📞', '✏️', '📁', '🗓️', '⏰', '💰', '🎓', '📖', '✅'],
  },
  {
    name: '娱乐',
    emojis: ['🎮', '🎬', '🎵', '📺', '🎨', '📸', '🎭', '🎪', '🎤', '🎸', '🎲', '♟️'],
  },
];

const COLOR_OPTIONS = [
  { name: 'amber', class: 'bg-amber-400', hex: '#fbbf24' },
  { name: 'rose', class: 'bg-rose-400', hex: '#fb7185' },
  { name: 'emerald', class: 'bg-emerald-400', hex: '#34d399' },
  { name: 'sky', class: 'bg-sky-400', hex: '#38bdf8' },
  { name: 'violet', class: 'bg-violet-400', hex: '#a78bfa' },
  { name: 'orange', class: 'bg-orange-400', hex: '#fb923c' },
  { name: 'pink', class: 'bg-pink-400', hex: '#f472b6' },
  { name: 'cyan', class: 'bg-cyan-400', hex: '#22d3ee' },
  { name: 'lime', class: 'bg-lime-400', hex: '#a3e635' },
  { name: 'indigo', class: 'bg-indigo-400', hex: '#818cf8' },
];

export const IconPicker = ({ 
  open, 
  onOpenChange, 
  icon, 
  color, 
  onIconChange, 
  onColorChange 
}: IconPickerProps) => {
  const [customEmoji, setCustomEmoji] = useState('');
  const colorInfo = getColorClasses(color);

  const handleCustomEmojiChange = (value: string) => {
    setCustomEmoji(value);
    if (value) {
      const chars = [...value];
      onIconChange(chars[chars.length - 1]);
    }
  };

  const previewBgStyle = colorInfo.isCustom
    ? { backgroundColor: hexToRgba(colorInfo.hex, 0.2) }
    : undefined;

  const previewBgClass = colorInfo.isCustom
    ? ''
    : `bg-${color}-100`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8 pt-6 max-h-[80vh] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-lg font-semibold text-center">选择图标和颜色</SheetTitle>
        </SheetHeader>

        {/* Preview */}
        <div className="flex justify-center mb-6">
          <div 
            className={cn(
              'w-20 h-20 rounded-2xl flex items-center justify-center',
              previewBgClass
            )}
            style={previewBgStyle}
          >
            <span className="text-4xl">{icon}</span>
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-muted-foreground mb-3 block">颜色</label>
          <div className="flex flex-wrap gap-3 items-center">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.name}
                onClick={() => onColorChange(c.name)}
                className={cn(
                  'w-8 h-8 rounded-full transition-all',
                  c.class,
                  color === c.name 
                    ? 'ring-2 ring-offset-2 ring-foreground/30 scale-110' 
                    : 'opacity-70 hover:opacity-100'
                )}
              />
            ))}
            {/* Custom Color Picker */}
            <div className="relative">
              <input
                type="color"
                value={color.startsWith('#') ? color : COLOR_OPTIONS.find(c => c.name === color)?.hex || '#38bdf8'}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 overflow-hidden"
                style={{ 
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              />
              {color.startsWith('#') && (
                <div 
                  className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-foreground/30 pointer-events-none"
                  style={{ backgroundColor: color }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Custom Emoji Input */}
        <div className="mb-6">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">自定义图标</label>
          <Input
            value={customEmoji}
            onChange={(e) => handleCustomEmojiChange(e.target.value)}
            placeholder="输入任意 emoji"
            className="h-12 text-center text-2xl rounded-xl"
          />
        </div>

        {/* Emoji Categories */}
        <div className="space-y-5">
          {EMOJI_CATEGORIES.map((category) => (
            <div key={category.name}>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                {category.name}
              </label>
              <div className="flex flex-wrap gap-2">
                {category.emojis.map((emoji, index) => (
                  <button
                    key={`${category.name}-${index}`}
                    onClick={() => {
                      onIconChange(emoji);
                      setCustomEmoji('');
                    }}
                    className={cn(
                      'w-11 h-11 text-xl rounded-xl transition-all flex items-center justify-center',
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
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
