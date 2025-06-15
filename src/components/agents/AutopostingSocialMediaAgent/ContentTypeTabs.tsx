
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormField, FormItem, FormControl, FormMessage, FormDescription, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ContentTypeTabs({ form }: any) {
  return (
    <Tabs defaultValue={form.watch("contentType")} onValueChange={(v) => form.setValue("contentType", v)} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="manual"><FileText className="mr-2 h-4 w-4" />Manual</TabsTrigger>
        <TabsTrigger value="pdf"><Upload className="mr-2 h-4 w-4" />From PDF</TabsTrigger>
        <TabsTrigger value="ai"><Sparkles className="mr-2 h-4 w-4" />Generate with AI</TabsTrigger>
      </TabsList>
      <TabsContent value="manual" className="pt-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="What's on your mind?" {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>
      <TabsContent value="pdf" className="pt-4">
        <FormField
          control={form.control}
          name="pdfFile"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Upload PDF</FormLabel>
              <FormControl>
                <Input type="file" accept=".pdf" {...fieldProps} onChange={(e) => onChange(e.target.files)} />
              </FormControl>
              <FormDescription>Upload a PDF to extract content. Full processing coming soon.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>
      <TabsContent value="ai" className="pt-4">
        <FormField
          control={form.control}
          name="aiPrompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="e.g., Write a post about the benefits of remote work" {...field} rows={5} />
              </FormControl>
              <FormDescription>Describe the content you want the AI to generate for your post.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>
    </Tabs>
  );
}
