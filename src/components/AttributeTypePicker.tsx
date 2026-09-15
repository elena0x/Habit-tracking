import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Hash, Check, List, Type, ToggleLeft, Star, Clock } from 'lucide-react';
import type { AttributeType } from '@/types';

interface AttributeTypePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: AttributeType) => void;
}

const ATTRIBUTE_TYPES: { type: AttributeType; name: string; desc: string; icon: React.ReactNode }[] = [
  { type: 'number', name: 'Number', desc: 'Track values such as price, distance, or weight', icon: <Hash className="w-5 h-5" /> },
  { type: 'single_select', name: 'Single select', desc: 'Choose one item from a list of options', icon: <Check className="w-5 h-5" /> },
  { type: 'multi_select', name: 'Multi-select', desc: 'Choose several items from a list of options', icon: <List className="w-5 h-5" /> },
  { type: 'text', name: 'Text', desc: 'Capture context such as a place or person', icon: <Type className="w-5 h-5" /> },
  { type: 'toggle', name: 'Yes / no', desc: 'Record a simple boolean answer', icon: <ToggleLeft className="w-5 h-5" /> },
  { type: 'rating', name: 'Rating', desc: 'Rate a meal, movie, mood, or experience', icon: <Star className="w-5 h-5" /> },
  { type: 'time', name: 'Time', desc: 'Capture a specific time of day', icon: <Clock className="w-5 h-5" /> },
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
              Cancel
            </button>
            <SheetTitle className="text-lg font-semibold">Choose a field type</SheetTitle>
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
