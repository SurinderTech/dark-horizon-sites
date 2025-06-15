
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar, Repeat } from "lucide-react";
export default function SchedulingTypeSelector({ control, name }: any) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 transition-colors hover:bg-accent hover:text-accent-foreground has-[:checked]:bg-accent">
                <FormControl>
                  <RadioGroupItem value="specificDate" />
                </FormControl>
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <FormLabel className="font-normal cursor-pointer flex-1 w-full">
                  Specific Date
                </FormLabel>
              </FormItem>
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 transition-colors hover:bg-accent hover:text-accent-foreground has-[:checked]:bg-accent">
                <FormControl>
                  <RadioGroupItem value="recurring" />
                </FormControl>
                <Repeat className="h-5 w-5 text-muted-foreground" />
                <FormLabel className="font-normal cursor-pointer flex-1 w-full">
                  Recurring
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
