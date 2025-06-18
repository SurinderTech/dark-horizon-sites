
import React from "react";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimePickerInputProps {
  control: any;
  name: string;
}

export default function TimePickerInput({ control, name }: TimePickerInputProps) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const parseTime = (timeStr: string) => {
          if (!timeStr) return { hour: '', minute: '', period: '' };
          const [time, period] = timeStr.split(' ');
          if (!time || !period) return { hour: '', minute: '', period: '' };
          const [hour, minute] = time.split(':');
          return { hour: hour || '', minute: minute || '', period: period || '' };
        };

        const formatTime = (hour: string, minute: string, period: string) => {
          if (!hour || !minute || !period) return '';
          const paddedMinute = minute.toString().padStart(2, '0');
          return `${hour}:${paddedMinute} ${period}`;
        };

        const { hour, minute, period } = parseTime(field.value || '');

        const updateTime = (newHour?: string, newMinute?: string, newPeriod?: string) => {
          const finalHour = newHour !== undefined ? newHour : hour;
          const finalMinute = newMinute !== undefined ? newMinute : minute;
          const finalPeriod = newPeriod !== undefined ? newPeriod : period;
          
          console.log('Updating time:', { finalHour, finalMinute, finalPeriod });
          
          if (finalHour && finalMinute && finalPeriod) {
            const formattedTime = formatTime(finalHour, finalMinute, finalPeriod);
            console.log('Formatted time:', formattedTime);
            field.onChange(formattedTime);
          }
        };

        return (
          <FormItem>
            <FormLabel>Time</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Select
                  value={hour}
                  onValueChange={(value) => {
                    console.log('Hour selected:', value);
                    updateTime(value, minute, period);
                  }}
                >
                  <SelectTrigger className="w-20 bg-background border-border text-foreground">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-lg z-[9999] max-h-60 overflow-y-auto">
                    {hours.map((h) => (
                      <SelectItem key={h} value={h.toString()} className="text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              
              <FormControl>
                <Select
                  value={minute}
                  onValueChange={(value) => {
                    console.log('Minute selected:', value);
                    updateTime(hour, value, period);
                  }}
                >
                  <SelectTrigger className="w-20 bg-background border-border text-foreground">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-lg z-[9999] max-h-60 overflow-y-auto">
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m.toString()} className="text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">
                        {m.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              
              <FormControl>
                <Select
                  value={period}
                  onValueChange={(value) => {
                    console.log('Period selected:', value);
                    updateTime(hour, minute, value);
                  }}
                >
                  <SelectTrigger className="w-20 bg-background border-border text-foreground">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-lg z-[9999]">
                    <SelectItem value="AM" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">AM</SelectItem>
                    <SelectItem value="PM" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">PM</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
