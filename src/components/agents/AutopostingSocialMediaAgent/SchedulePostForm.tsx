import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import PlatformCheckboxes from "./PlatformCheckboxes";
import ContentTypeTabs from "./ContentTypeTabs";
import SchedulingTypeSelector from "./SchedulingTypeSelector";
import DayOfWeekCheckboxes from "./DayOfWeekCheckboxes";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addDays, set } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { getTextFromPdf } from "./pdfUtils";

// Extend the schema: add image field (optional)
const formSchema = z.object({
  platforms: z.array(z.string()).nonempty({ message: 'Please select at least one platform.' }),
  time: z.string().min(1, 'Please select a time.'),
  contentType: z.enum(['manual', 'pdf', 'ai']).default('manual'),
  content: z.string().optional(),
  pdfFile: z.any().optional(),
  aiPrompt: z.string().optional(),
  image: z.any().optional(),
  scheduleType: z.enum(['specificDate', 'recurring']).default('specificDate'),
  specificDate: z.string().optional(),
  recurringDays: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  if (data.contentType === 'manual' && (!data.content || data.content.trim().length === 0)) {
    ctx.addIssue({ code: 'custom', path: ['content'], message: 'Content cannot be empty.' });
  }
  if (data.contentType === 'pdf' && (!data.pdfFile || data.pdfFile.length === 0)) {
    ctx.addIssue({ code: 'custom', path: ['pdfFile'], message: 'Please upload a PDF file.' });
  }
  if (data.contentType === 'ai' && (!data.aiPrompt || data.aiPrompt.trim().length === 0)) {
    ctx.addIssue({ code: 'custom', path: ['aiPrompt'], message: 'AI prompt cannot be empty.' });
  }
  if (data.scheduleType === 'specificDate' && !data.specificDate) {
    ctx.addIssue({ code: 'custom', path: ['specificDate'], message: 'Please select a date.' });
  }
  if (data.scheduleType === 'recurring' && (!data.recurringDays || data.recurringDays.length === 0)) {
    ctx.addIssue({ code: 'custom', path: ['recurringDays'], message: 'Please select at least one day.' });
  }
});

const dayMapping: { [key: string]: number } = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// Helper: upload image file to Supabase Storage and get its public URL
async function uploadPostImage(file: File): Promise<{ url: string, name: string }> {
  const fileExt = file.name.split(".").pop();
  const newFileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;
  const { data, error } = await supabase.storage.from('post-images').upload(newFileName, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw new Error(error.message);
  // Get public URL
  const { data: publicData } = supabase.storage.from('post-images').getPublicUrl(newFileName);
  const url = publicData?.publicUrl;
  if (!url) throw new Error("Failed to get public image URL.");
  return { url, name: file.name };
}

export default function SchedulePostForm({ onPostsScheduled }: any) {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Scheduling...");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platforms: [],
      content: '',
      time: '',
      contentType: 'manual',
      aiPrompt: '',
      scheduleType: 'specificDate',
      specificDate: '',
      recurringDays: [],
      image: undefined,
    },
  });

  const scheduleTwitterPost = async ({
    content,
    scheduled_at,
    imageUrl,
    attachmentName,
  }: { content: string; scheduled_at: Date; imageUrl?: string; attachmentName?: string }) => {
    const { error } = await supabase.from('scheduled_posts' as any).insert({
      platform: "twitter",
      content,
      scheduled_at: scheduled_at.toISOString(),
      image_url: imageUrl,
      attachment_name: attachmentName,
    });
    if (error) throw new Error(error.message);
    return true;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    let postContent: string | undefined = values.content;
    let imageUrl: string | undefined = undefined;
    let attachmentName: string | undefined = undefined;

    try {
      // Handle content based on type
      if (values.contentType === 'ai') {
        setLoadingMessage('Generating AI content...');
        const { data, error } = await supabase.functions.invoke('generate-text-content', {
          body: { prompt: values.aiPrompt },
        });
        if (error) throw new Error(error.message);
        postContent = data.generatedText;
      } else if (values.contentType === 'pdf') {
        setLoadingMessage('Processing PDF...');
        const file = values.pdfFile[0];
        attachmentName = file.name;
        postContent = await getTextFromPdf(file);
      }

      // If image attached (only for manual or ai), upload to storage
      if (
        (values.contentType === "manual" || values.contentType === "ai")
        && values.image && values.image.length > 0
      ) {
        setLoadingMessage('Uploading image...');
        try {
          const uploadResult = await uploadPostImage(values.image[0]);
          imageUrl = uploadResult.url;
          attachmentName = uploadResult.name;
        } catch (e: any) {
          toast.error(`Failed to upload image: ${e.message}`);
          // Optionally decide whether you want to block scheduling on image upload failure
        }
      }

      setLoadingMessage('Scheduling...');
      const newPosts = [];
      const [hours, minutes] = values.time.split(':').map(Number);

      if (values.scheduleType === "specificDate" && values.specificDate) {
        const scheduled_at = new Date(`${values.specificDate}T${values.time}`);
        for (const platform of values.platforms) {
          if (platform.toLowerCase() === "twitter") {
            try {
              await scheduleTwitterPost({ content: postContent || "", scheduled_at, imageUrl, attachmentName });
              toast.success("Twitter post scheduled!");
            } catch (twitterErr: any) {
              toast.error("Failed to schedule Twitter post: " + twitterErr.message);
            }
          }
          newPosts.push({
            id: Date.now() + Math.random(),
            platform,
            content: postContent || "",
            date: values.specificDate!,
            time: values.time,
            status: "Scheduled",
            scheduled_at,
            imageUrl,
            attachmentName,
          });
        }
      } else if (values.scheduleType === "recurring" && values.recurringDays) {
        values.recurringDays.forEach(dayName => {
          const dayIndex = dayMapping[dayName.toLowerCase()];
          const now = new Date();
          const targetDateAtTime = set(now, { hours, minutes, seconds: 0, milliseconds: 0 });
          const currentDayIndex = now.getDay();
          let daysToAdd = dayIndex - currentDayIndex;
          if (daysToAdd < 0 || (daysToAdd === 0 && targetDateAtTime < now)) {
            daysToAdd += 7;
          }
          const scheduled_at = addDays(now, daysToAdd);
          const finalDate = set(scheduled_at, { hours, minutes, seconds: 0, milliseconds: 0 });

          values.platforms.forEach(platform => {
            if (platform.toLowerCase() === "twitter") {
              scheduleTwitterPost({ content: postContent || "", scheduled_at: finalDate, imageUrl, attachmentName })
                .then(() => toast.success("Twitter post scheduled!"))
                .catch((err) => toast.error("Failed to schedule Twitter post: " + err.message));
            }
            newPosts.push({
              id: Date.now() + Math.random(),
              platform,
              content: postContent || "",
              date: finalDate.toISOString().split("T")[0],
              time: values.time,
              status: "Scheduled",
              scheduled_at: finalDate,
              imageUrl,
              attachmentName,
            });
          });
        });
      }

      setTimeout(() => {
        onPostsScheduled(newPosts);
        toast.success(`Posts scheduled successfully!`);
        form.reset();
        setLoading(false);
      }, 500);

    } catch (error: any) {
      console.error('Error submitting post:', error);
      toast.error(`Failed to schedule post: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new social media post</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/** 
             * PATCH: The PlatformCheckboxes component expects `control` from react-hook-form's useForm,
             * which is already what we are providing as `form.control`.
             * However, if it's still failing, we can add a type check here and log it:
             */}
            {typeof form.control === "object" && typeof form.control.getValues === "function" ? (
              <PlatformCheckboxes control={form.control} name="platforms" />
            ) : (
              <div className="border p-4 rounded bg-destructive text-destructive-foreground mb-4">
                Internal Error: PlatformCheckboxes did not receive a valid form control object.
              </div>
            )}
            <ContentTypeTabs form={form} />

            {/* Show image upload only for compatible content types */}
            {(form.watch("contentType") === "manual" || form.watch("contentType") === "ai") && (
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...fieldProps } }) => (
                  <div>
                    <FormLabel>Image (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        {...fieldProps}
                        onChange={(e) => onChange(e.target.files)}
                      />
                    </FormControl>
                    {/* Show preview if file selected */}
                    {value && value.length > 0 && typeof window !== "undefined" && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(value[0])}
                          alt="Preview"
                          className="max-h-32 rounded"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </div>
                )}
              />
            )}

            <div className="space-y-4 rounded-md border p-4">
              <SchedulingTypeSelector control={form.control} name="scheduleType" />

              {form.watch('scheduleType') === 'specificDate' && (
                <FormField
                  control={form.control}
                  name="specificDate"
                  render={({ field }) => (
                    <div>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />
              )}

              {form.watch('scheduleType') === 'recurring' && (
                <DayOfWeekCheckboxes control={form.control} name="recurringDays" />
              )}

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <div>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? loadingMessage : 'Schedule Post'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// NOTE: This file is over 250 lines and growing. You should consider refactoring it into smaller files for maintainability!
