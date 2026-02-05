import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import type { AttributeType, EventAttribute, SelectOption } from '@/types';
import * as storage from '@/lib/storage';

interface AttributeEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: AttributeType;
  onSave: (attribute: EventAttribute) => void;
  existingAttribute?: EventAttribute;
}

const TYPE_NAMES: Record<AttributeType, string> = {
  number: '数值',
  single_select: '单选',
  multi_select: '多选',
  text: '文本',
  toggle: '开关',
  rating: '评分',
  time: '时间',
};

export const AttributeEditor = ({ 
  open, 
  onOpenChange, 
  type, 
  onSave,
  existingAttribute 
}: AttributeEditorProps) => {
  const [name, setName] = useState(existingAttribute?.name || '');
  const [required, setRequired] = useState(existingAttribute?.required || false);
  const [options, setOptions] = useState<SelectOption[]>(
    existingAttribute?.options || []
  );
  const [newOption, setNewOption] = useState('');

  const needsOptions = type === 'single_select' || type === 'multi_select';

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    setOptions([...options, { id: storage.generateId(), label: newOption.trim() }]);
    setNewOption('');
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter(o => o.id !== id));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    const attribute: EventAttribute = {
      id: existingAttribute?.id || storage.generateId(),
      name: name.trim(),
      type,
      required,
      ...(needsOptions && { options }),
    };
    
    onSave(attribute);
    onOpenChange(false);
    
    // Reset form
    setName('');
    setRequired(false);
    setOptions([]);
    setNewOption('');
  };

  const canSave = name.trim() && (!needsOptions || options.length > 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8 pt-6 max-h-[80vh] overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground text-base"
            >
              取消
            </button>
            <SheetTitle className="text-lg font-semibold">
              添加{TYPE_NAMES[type]}属性
            </SheetTitle>
            <div className="w-10" />
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Attribute Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">属性名称</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：金额、心情、地点..."
              className="h-12 text-base rounded-xl"
            />
          </div>

          {/* Required Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm font-medium text-foreground">必填</span>
              <p className="text-xs text-muted-foreground mt-0.5">记录时必须填写此属性</p>
            </div>
            <Switch
              checked={required}
              onCheckedChange={setRequired}
            />
          </div>

          {/* Options for select types */}
          {needsOptions && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">选项列表</label>
              
              {/* Existing options */}
              <div className="space-y-2">
                {options.map((option) => (
                  <div 
                    key={option.id}
                    className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl"
                  >
                    <span className="flex-1 text-sm">{option.label}</span>
                    <button
                      onClick={() => handleRemoveOption(option.id)}
                      className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add new option */}
              <div className="flex gap-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="输入选项名称"
                  className="h-10 rounded-xl flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
                <Button
                  onClick={handleAddOption}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl"
                  disabled={!newOption.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            disabled={!canSave}
            className="w-full h-12 rounded-xl text-base font-medium"
          >
            保存属性
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
