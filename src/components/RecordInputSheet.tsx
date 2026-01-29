import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AttributeField } from './AttributeInputs';
import type { Event, EventAttribute } from '@/types';
import { cn } from '@/lib/utils';
import { getColorClasses, hexToRgba } from '@/lib/colorUtils';

interface RecordInputSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onConfirm: (eventId: string, data: { note?: string; extra?: Record<string, unknown> }) => void;
}

export const RecordInputSheet = ({ 
  open, 
  onOpenChange, 
  event, 
  onConfirm 
}: RecordInputSheetProps) => {
  const [note, setNote] = useState('');
  const [attributeValues, setAttributeValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when sheet opens
  useEffect(() => {
    if (open) {
      setNote('');
      setAttributeValues({});
      setErrors({});
    }
  }, [open]);

  const handleAttributeChange = (attrId: string, value: unknown) => {
    setAttributeValues(prev => ({ ...prev, [attrId]: value }));
    // Clear error when value changes
    if (errors[attrId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[attrId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    if (!event?.attributes) return true;
    
    const newErrors: Record<string, string> = {};
    
    event.attributes.forEach(attr => {
      if (attr.required) {
        const value = attributeValues[attr.id];
        if (value === undefined || value === null || value === '') {
          newErrors[attr.id] = `请填写${attr.name}`;
        } else if (Array.isArray(value) && value.length === 0) {
          newErrors[attr.id] = `请选择${attr.name}`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!event) return;
    
    if (!validateForm()) return;
    
    const extra = Object.keys(attributeValues).length > 0 ? attributeValues : undefined;
    onConfirm(event.id, { 
      note: note.trim() || undefined, 
      extra 
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setNote('');
    setAttributeValues({});
    setErrors({});
    onOpenChange(false);
  };

  if (!event) return null;

  const hasAttributes = event.attributes && event.attributes.length > 0;
  const colorInfo = getColorClasses(event.color || 'sky');
  const iconBgStyle = colorInfo.isCustom
    ? { backgroundColor: hexToRgba(colorInfo.hex, 0.15) }
    : undefined;
  const iconBgClass = colorInfo.isCustom
    ? ''
    : `bg-${event.color}-100`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-0 pb-8 pt-0 max-h-[85vh] flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleCancel}
              className="text-muted-foreground text-base"
            >
              取消
            </button>
            <SheetTitle className="text-lg font-semibold">记录</SheetTitle>
            <button 
              onClick={handleConfirm}
              className="text-base font-medium text-primary"
            >
              确定
            </button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-4 space-y-6">
            {/* Event info */}
            <div className="flex items-center gap-3">
              <div 
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  iconBgClass
                )}
                style={iconBgStyle}
              >
                <span className="text-2xl">{event.icon}</span>
              </div>
              <span className="text-lg font-medium">{event.name}</span>
            </div>

            {/* Attribute inputs */}
            {hasAttributes && (
              <div className="space-y-4">
                {event.attributes!.map(attr => (
                  <AttributeField
                    key={attr.id}
                    attribute={attr}
                    value={attributeValues[attr.id]}
                    onChange={(value) => handleAttributeChange(attr.id, value)}
                    error={errors[attr.id]}
                  />
                ))}
              </div>
            )}

            {/* Note input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">备注</label>
              <Textarea
                placeholder="记录一些内容... (可选)"
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 500))}
                className="min-h-[80px] resize-none rounded-xl border-muted focus-visible:ring-primary"
              />
              <p className="text-xs text-muted-foreground text-right">
                {note.length}/500
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="px-6 pt-4 border-t border-border/50">
          <Button
            onClick={handleConfirm}
            className="w-full h-12 rounded-xl text-base font-medium"
          >
            <Pencil className="w-4 h-4 mr-2" />
            记录
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
