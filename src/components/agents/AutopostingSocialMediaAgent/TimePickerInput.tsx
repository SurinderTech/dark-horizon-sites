
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
          return { hour, minute, period };
        };

        const formatTime = (hour: string, minute: string, period: string) => {
          if (!hour || !minute || !period) return '';
          const paddedMinute = minute.toString().padStart(2, '0');
          return `${hour}:${paddedMinute} ${period}`;
        };

        const { hour, minute, period } = parseTime(field.value || '');

        const updateTime = (newHour: string, newMinute: string, newPeriod: string) => {
          const formattedTime = formatTime(newHour || hour, newMinute || minute, newPeriod || period);
          field.onChange(formattedTime);
        };

        return (
          <FormItem>
            <FormLabel>Time</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Select
                  value={hour}
                  onValueChange={(value) => updateTime(value, minute, period)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto">
                    {hours.map((h) => (
                      <SelectItem key={h} value={h.toString()} className="hover:bg-gray-100">
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              
              <FormControl>
                <Select
                  value={minute}
                  onValueChange={(value) => updateTime(hour, value, period)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto">
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m.toString()} className="hover:bg-gray-100">
                        {m.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              
              <FormControl>
                <Select
                  value={period}
                  onValueChange={(value) => updateTime(hour, minute, value)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="AM" className="hover:bg-gray-100">AM</SelectItem>
                    <SelectItem value="PM" className="hover:bg-gray-100">PM</SelectItem>
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
