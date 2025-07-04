
import React from "react";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimePickerInputProps {
  control: any;
  name: string;
}

export default function TimePickerInput({ control, name }: TimePickerInputProps) {
  // Generate time options in 30-minute intervals
  const timeOptions = [];
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute of [0, 30]) {
      const period = 'AM';
      const timeStr = `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
      timeOptions.push({ value: timeStr, label: timeStr });
    }
  }
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute of [0, 30]) {
      const period = 'PM';
      const timeStr = `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
      timeOptions.push({ value: timeStr, label: timeStr });
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Time</FormLabel>
          <FormControl>
            <Select
              value={field.value || ''}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-32 bg-background border-border text-foreground">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-lg z-[9999] max-h-60 overflow-y-auto">
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
