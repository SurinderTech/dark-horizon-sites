
import React from "react";
import { FormField, FormLabel, FormDescription, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
const dayOfWeekOptions = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];
export default function DayOfWeekCheckboxes({ control, name }: any) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="mb-4">
            <FormLabel>Days of the week</FormLabel>
            <FormDescription>Select the days you want to post on.</FormDescription>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dayOfWeekOptions.map((item) => (
              <FormItem
                key={item.id}
                className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 transition-colors hover:bg-accent hover:text-accent-foreground has-[:checked]:bg-accent"
              >
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      const value = field.value || [];
                      field.onChange(
                        checked
                          ? [...value, item.id]
                          : value.filter((v: string) => v !== item.id)
                      );
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer flex-1 w-full">
                  {item.label}
                </FormLabel>
              </FormItem>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
