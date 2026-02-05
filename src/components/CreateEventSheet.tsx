import { useState } from 'react';
import { ChevronRight, Plus, Info, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { IconPicker } from './IconPicker';
import { AttributeTypePicker } from './AttributeTypePicker';
import { AttributeEditor } from './AttributeEditor';
import { EventTemplates, type EventTemplate } from './EventTemplates';
import type { EventType, EventAttribute, AttributeType } from '@/types';
import { cn } from '@/lib/utils';
import { getColorClasses, hexToRgba } from '@/lib/colorUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CreateEventSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { 
    name: string; 
    type: EventType; 
    icon: string; 
    color: string;
    quickRecord?: boolean;
    attributes?: EventAttribute[];
  }) => void;
}

const TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: 'daily', label: '日常' },
  { value: 'once', label: '一次性' },
  { value: 'log', label: '记录' },
];

type ViewMode = 'templates' | 'form';

export const CreateEventSheet = ({ open, onOpenChange, onSubmit }: CreateEventSheetProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('templates');
  const [selectedCategory, setSelectedCategory] = useState('所有');
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<EventType>('daily');
  const [icon, setIcon] = useState('📝');
  const [color, setColor] = useState('sky');
  const [quickRecord, setQuickRecord] = useState(false);
  const [attributes, setAttributes] = useState<EventAttribute[]>([]);
  
  // Sub-dialogs
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [attributeTypePickerOpen, setAttributeTypePickerOpen] = useState(false);
  const [attributeEditorOpen, setAttributeEditorOpen] = useState(false);
  const [editingAttributeType, setEditingAttributeType] = useState<AttributeType>('text');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ 
      name: name.trim(), 
      type, 
      icon, 
      color,
      quickRecord,
      attributes: attributes.length > 0 ? attributes : undefined,
    });
    resetForm();
    onOpenChange(false);
  };

  const handleSelectTemplate = (template: EventTemplate) => {
    onSubmit({ 
      name: template.name, 
      type: template.type, 
      icon: template.icon, 
      color: template.color,
      quickRecord: false,
      attributes: template.attributes,
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
    setQuickRecord(false);
    setAttributes([]);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handleAddAttribute = (attribute: EventAttribute) => {
    setAttributes([...attributes, attribute]);
  };

  const handleRemoveAttribute = (id: string) => {
    setAttributes(attributes.filter(a => a.id !== id));
  };

  const handleSelectAttributeType = (attrType: AttributeType) => {
    setEditingAttributeType(attrType);
    setAttributeEditorOpen(true);
  };

  const colorInfo = getColorClasses(color);
  const iconBgStyle = colorInfo.isCustom
    ? { backgroundColor: hexToRgba(colorInfo.hex, 0.15) }
    : undefined;
  const iconBgClass = colorInfo.isCustom
    ? ''
    : `bg-${color}-100`;

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl px-0 pb-8 pt-0 max-h-[90vh] overflow-hidden flex flex-col">
          {viewMode === 'templates' ? (
            <>
              <SheetHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleOpenChange(false)}
                    className="text-muted-foreground text-base"
                  >
                    取消
                  </button>
                  <SheetTitle className="text-lg font-semibold">新建事件</SheetTitle>
                  <div className="w-10" />
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6">
                <p className="text-sm text-muted-foreground mb-4">
                  没有想法？从选取一些预设事件开始吧
                </p>
                
                <EventTemplates
                  onSelectTemplate={handleSelectTemplate}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />

                <div className="space-y-3 pt-6 pb-4">
                  <Button 
                    onClick={() => setViewMode('form')}
                    className="w-full h-12 rounded-xl text-base font-medium"
                  >
                    自定义事件
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleOpenChange(false)}
                    className="text-muted-foreground text-base"
                  >
                    取消
                  </button>
                  <SheetTitle className="text-lg font-semibold">新建事件</SheetTitle>
                  <button 
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    className={cn(
                      "text-base font-medium",
                      name.trim() ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    新建
                  </button>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                {/* Icon and Name Section */}
                <div className="px-6 py-4 flex items-center gap-4">
                  <button
                    onClick={() => setIconPickerOpen(true)}
                    className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105',
                      iconBgClass
                    )}
                    style={iconBgStyle}
                  >
                    <span className="text-3xl">{icon}</span>
                  </button>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 50))}
                    placeholder="事件名称"
                    className="h-14 text-lg rounded-xl border-border/50 bg-muted/30 flex-1"
                    maxLength={50}
                  />
                </div>

                {/* Basic Settings Section */}
                <div className="px-6 py-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">基本</h3>
                  <div className="bg-muted/30 rounded-2xl overflow-hidden">
                    {/* Event Type */}
                    <button
                      onClick={() => setTypePickerOpen(true)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">事件类型</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>日常：可重复打卡<br/>一次性：只记录一次<br/>记录：需填写内容</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>{TYPE_OPTIONS.find(t => t.value === type)?.label}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>

                    <div className="h-px bg-border/50 mx-4" />

                    {/* Quick Record */}
                    <div className="w-full flex items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">快速记录</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>开启后，点击图标立即记录</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Switch
                        checked={quickRecord}
                        onCheckedChange={(checked) => {
                          setQuickRecord(checked);
                          // Quick record doesn't support attributes
                          if (checked) {
                            setAttributes([]);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Attributes Section */}
                {!quickRecord && (
                  <div className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-medium text-foreground">属性</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>添加自定义字段，记录时可填写</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="bg-muted/30 rounded-2xl overflow-hidden">
                      {/* Existing attributes */}
                      {attributes.map((attr, index) => (
                        <div key={attr.id}>
                          {index > 0 && <div className="h-px bg-border/50 mx-4" />}
                          <div className="flex items-center justify-between p-4">
                            <span className="text-foreground">{attr.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{attr.type}</span>
                              <button
                                onClick={() => handleRemoveAttribute(attr.id)}
                                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
                              >
                                <Trash2 className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {attributes.length > 0 && <div className="h-px bg-border/50 mx-4" />}
                      
                      {/* Add Attribute Button */}
                      <button
                        onClick={() => setAttributeTypePickerOpen(true)}
                        className="w-full flex items-center justify-center gap-2 p-4 text-primary hover:bg-muted/50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>新增</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Back to templates link */}
                <div className="px-6 py-4">
                  <button 
                    onClick={() => setViewMode('templates')}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← 返回预设模版
                  </button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Type Picker Sheet */}
      <Sheet open={typePickerOpen} onOpenChange={setTypePickerOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8 pt-6">
          <SheetHeader className="mb-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setTypePickerOpen(false)}
                className="text-muted-foreground text-base"
              >
                取消
              </button>
              <SheetTitle className="text-lg font-semibold">选择事件类型</SheetTitle>
              <div className="w-10" />
            </div>
          </SheetHeader>
          <div className="space-y-2">
            {TYPE_OPTIONS.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setType(t.value);
                  setTypePickerOpen(false);
                }}
                className={cn(
                  'w-full p-4 rounded-xl text-left transition-colors',
                  type === t.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/50 hover:bg-muted'
                )}
              >
                <div className="font-medium">{t.label}</div>
                <div className={cn(
                  'text-sm mt-0.5',
                  type === t.value ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}>
                  {t.value === 'daily' && '可重复打卡'}
                  {t.value === 'once' && '发生一次的事'}
                  {t.value === 'log' && '需要填写内容'}
                </div>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Icon Picker */}
      <IconPicker
        open={iconPickerOpen}
        onOpenChange={setIconPickerOpen}
        icon={icon}
        color={color}
        onIconChange={setIcon}
        onColorChange={setColor}
      />

      {/* Attribute Type Picker */}
      <AttributeTypePicker
        open={attributeTypePickerOpen}
        onOpenChange={setAttributeTypePickerOpen}
        onSelect={handleSelectAttributeType}
      />

      {/* Attribute Editor */}
      <AttributeEditor
        open={attributeEditorOpen}
        onOpenChange={setAttributeEditorOpen}
        type={editingAttributeType}
        onSave={handleAddAttribute}
      />
    </>
  );
};
