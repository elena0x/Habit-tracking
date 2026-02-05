import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Hash, Check, List, Type, ToggleLeft, Star, Clock } from 'lucide-react';
import type { AttributeType } from '@/types';

interface AttributeTypePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: AttributeType) => void;
}

const ATTRIBUTE_TYPES: { type: AttributeType; name: string; desc: string; icon: React.ReactNode }[] = [
  { type: 'number', name: '数值类型', desc: '可以用来追踪价格、重量等数值', icon: <Hash className="w-5 h-5" /> },
  { type: 'single_select', name: '单选类型', desc: '从预设的选项中单选', icon: <Check className="w-5 h-5" /> },
  { type: 'multi_select', name: '多选类型', desc: '从预设的选项中多选', icon: <List className="w-5 h-5" /> },
  { type: 'text', name: '文本类型', desc: '文本内容，可以是地点、人名', icon: <Type className="w-5 h-5" /> },
  { type: 'toggle', name: '开关类型', desc: '轻松设置为是或否', icon: <ToggleLeft className="w-5 h-5" /> },
  { type: 'rating', name: '评分类型', desc: '用于给美食、电影评分', icon: <Star className="w-5 h-5" /> },
  { type: 'time', name: '时间类型', desc: '可以用来记录一个时间点', icon: <Clock className="w-5 h-5" /> },
];

export const AttributeTypePicker = ({ open, onOpenChange, onSelect }: AttributeTypePickerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8 pt-6 max-h-[70vh]">
        <SheetHeader className="mb-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground text-base"
            >
              取消
            </button>
            <SheetTitle className="text-lg font-semibold">请您选择属性类型</SheetTitle>
            <div className="w-10" />
          </div>
        </SheetHeader>

        <div className="space-y-1">
          {ATTRIBUTE_TYPES.map((attr) => (
            <button
              key={attr.type}
              onClick={() => {
                onSelect(attr.type);
                onOpenChange(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                {attr.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{attr.name}</div>
                <div className="text-sm text-muted-foreground">{attr.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
