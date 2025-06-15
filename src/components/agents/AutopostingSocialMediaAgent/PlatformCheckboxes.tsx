
import React from "react";
import { FormLabel, FormDescription, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
const platformOptions = [
  { id: 'Facebook', label: 'Facebook', icon: Facebook },
  { id: 'Twitter', label: 'Twitter', icon: Twitter },
  { id: 'LinkedIn', label: 'LinkedIn', icon: Linkedin },
  { id: 'Instagram', label: 'Instagram', icon: Instagram },
];
export default function PlatformCheckboxes({ control, name }: any) {
  return (
    <FormItem>
      <div className="mb-4">
        <FormLabel>Platforms</FormLabel>
        <FormDescription>
          Select the platforms you want to post to.
        </FormDescription>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platformOptions.map((item) => {
          const Icon = item.icon;
          return (
            <FormItem
              key={item.id}
              className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 transition-colors hover:bg-accent hover:text-accent-foreground has-[:checked]:bg-accent"
            >
              <FormControl>
                <Checkbox
                  checked={control.getValues(name)?.includes(item.id)}
                  onCheckedChange={(checked) => {
                    const value = control.getValues(name) || [];
                    control.setValue(
                      name,
                      checked
                        ? [...value, item.id]
                        : value.filter((v: string) => v !== item.id)
                    );
                  }}
                />
              </FormControl>
              <Icon className="h-5 w-5 text-muted-foreground" />
              <FormLabel className="font-normal cursor-pointer flex-1 w-full">
                {item.label}
              </FormLabel>
            </FormItem>
          );
        })}
      </div>
      <FormMessage />
    </FormItem>
  );
}
