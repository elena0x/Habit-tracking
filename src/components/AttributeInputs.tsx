import { useState } from 'react';
import { Star, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { EventAttribute } from '@/types';

interface AttributeInputProps {
  attribute: EventAttribute;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

// Number input with optional unit
export const NumberInput = ({ attribute, value, onChange, error }: AttributeInputProps) => {
  const unit = attribute.config?.unit;
  
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {attribute.name}
        {attribute.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          type="number"
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder={`请输入${attribute.name}`}
          className={cn(
            "rounded-xl",
            unit && "pr-12",
            error && "border-destructive"
          )}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

// Text input
export const TextInput = ({ attribute, value, onChange, error }: AttributeInputProps) => {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {attribute.name}
        {attribute.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        value={value as string || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`请输入${attribute.name}`}
        className={cn(
          "min-h-[80px] resize-none rounded-xl",
          error && "border-destructive"
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

// Single select (radio-like buttons)
export const SingleSelectInput = ({ attribute, value, onChange, error }: AttributeInputProps) => {
  const options = attribute.config?.options || [];
  
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {attribute.name}
        {attribute.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm transition-colors",
              value === option
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-foreground"
            )}
          >
            {option}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

// Multi select (checkbox-like buttons)
export const MultiSelectInput = ({ attribute, value, onChange, error }: AttributeInputProps) => {
  const options = attribute.config?.options || [];
  const selectedValues = (value as string[]) || [];
  
  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };
  
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {attribute.name}
        {attribute.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggleOption(option)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm transition-colors",
              selectedValues.includes(option)
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-foreground"
            )}
          >
            {option}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

// Toggle switch
export const ToggleInput = ({ attribute, value, onChange }: AttributeInputProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <Label className="text-sm font-medium">
        {attribute.name}
        {attribute.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Switch
        checked={value as boolean || false}
        onCheckedChange={(checked) => onChange(checked)}
      />
    </div>
  );
};

// Star rating
export const RatingInput = ({ attribute, value, onChange, error }: AttributeInputProps) => {
  const max = attribute.config?.max || 5;
  const currentValue = (value as number) || 0;
  
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {attribute.name}
        {attribute.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors",
                star <= currentValue
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

// Time picker
export const TimeInput = ({ attribute, value, onChange, error }: AttributeInputProps) => {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {attribute.name}
        {attribute.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          type="time"
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "rounded-xl",
            error && "border-destructive"
          )}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

// Main component to render the appropriate input based on attribute type
interface AttributeFieldProps {
  attribute: EventAttribute;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export const AttributeField = ({ attribute, value, onChange, error }: AttributeFieldProps) => {
  const props = { attribute, value, onChange, error };
  
  switch (attribute.type) {
    case 'number':
      return <NumberInput {...props} />;
    case 'text':
      return <TextInput {...props} />;
    case 'single_select':
      return <SingleSelectInput {...props} />;
    case 'multi_select':
      return <MultiSelectInput {...props} />;
    case 'toggle':
      return <ToggleInput {...props} />;
    case 'rating':
      return <RatingInput {...props} />;
    case 'time':
      return <TimeInput {...props} />;
    default:
      return <TextInput {...props} />;
  }
};
