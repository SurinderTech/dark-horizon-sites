import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Calendar, Clock, Send, List, Facebook, Twitter, Linkedin, Instagram, Upload, Sparkles, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  platforms: z.array(z.string()).nonempty({
    message: 'Please select at least one platform.',
  }),
  date: z.string().min(1, 'Please select a date.'),
  time: z.string().min(1, 'Please select a time.'),
  contentType: z.enum(['manual', 'pdf', 'ai']).default('manual'),
  content: z.string().optional(),
  pdfFile: z.any().optional(),
  aiPrompt: z.string().optional(),
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
});

const platformOptions = [
    { id: 'Facebook', label: 'Facebook', icon: Facebook },
    { id: 'Twitter', label: 'Twitter', icon: Twitter },
    { id: 'LinkedIn', label: 'LinkedIn', icon: Linkedin },
    { id: 'Instagram', label: 'Instagram', icon: Instagram },
];

interface Post {
  id: number;
  platform: string;
  content: string;
  date: string;
  time: string;
  status: string;
  scheduled_at: Date;
  imageUrl?: string;
  attachmentName?: string;
}

const AutopostingSocialMediaAgent = ({ agent }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Scheduling...');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platforms: [],
      content: '',
      date: '',
      time: '',
      contentType: 'manual',
      aiPrompt: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    let postContent: string | undefined = values.content;
    let imageUrl: string | undefined = undefined;
    let attachmentName: string | undefined = undefined;

    try {
        if (values.contentType === 'ai') {
            setLoadingMessage('Generating AI content...');
            const { data, error } = await supabase.functions.invoke('generate-image', {
                body: { prompt: values.aiPrompt },
            });

            if (error) {
                throw new Error(error.message);
            }
            imageUrl = data.imageUrl;
            postContent = values.aiPrompt;
        } else if (values.contentType === 'pdf') {
            setLoadingMessage('Processing PDF...');
            const file = values.pdfFile[0];
            attachmentName = file.name;
            postContent = `Content from PDF: ${file.name}. (Full processing coming soon!)`;
        }

        setLoadingMessage('Scheduling...');
        const scheduled_at = new Date(`${values.date}T${values.time}`);
        const newPosts = values.platforms.map((platform) => ({
            id: Date.now() + Math.random(),
            platform,
            content: postContent || '',
            date: values.date,
            time: values.time,
            status: 'Scheduled',
            scheduled_at,
            imageUrl,
            attachmentName,
        }));

        setTimeout(() => {
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            toast.success(`Posts scheduled for ${values.platforms.join(', ')} successfully!`);
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
    <div className="space-y-6">
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule">
            <Send className="mr-2 h-4 w-4" />
            Schedule Post
          </TabsTrigger>
          <TabsTrigger value="posts">
            <List className="mr-2 h-4 w-4" />
            Scheduled Posts ({posts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Create a new social media post</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="platforms"
                    render={() => (
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
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="platforms"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 transition-colors hover:bg-accent hover:text-accent-foreground has-[:checked]:bg-accent"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                ? field.onChange([...(field.value || []), item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== item.id
                                                                    )
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
                                        }}
                                    />
                                )
                            })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contentType"
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel>Content</FormLabel>
                         <Tabs defaultValue={field.value} onValueChange={field.onChange} className="w-full">
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
                                    render={({ field: { onChange, ...fieldProps }}) => (
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
                                            <Textarea placeholder="e.g., An astronaut riding a horse on the moon" {...field} rows={5} />
                                        </FormControl>
                                        <FormDescription>Describe the image you want to generate.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </TabsContent>
                         </Tabs>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
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
        </TabsContent>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Your Scheduled Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {posts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left">Platform</th>
                        <th className="border border-border p-2 text-left">Content</th>
                        <th className="border border-border p-2 text-left">Scheduled For</th>
                        <th className="border border-border p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.sort((a, b) => a.scheduled_at.getTime() - b.scheduled_at.getTime()).map((post) => (
                        <tr key={post.id}>
                          <td className="border border-border p-2 capitalize">{post.platform}</td>
                          <td className="border border-border p-2 max-w-xs">
                            <div className="flex flex-col gap-2">
                                {post.imageUrl && <img src={post.imageUrl} alt="Generated content" className="w-24 h-24 object-cover rounded-md" />}
                                {post.attachmentName && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted rounded-md">
                                        <FileText className="h-4 w-4" />
                                        <span className="truncate">{post.attachmentName}</span>
                                    </div>
                                )}
                                <p className="truncate">{post.content}</p>
                            </div>
                          </td>
                          <td className="border border-border p-2 whitespace-nowrap">
                            {post.scheduled_at.toLocaleString()}
                          </td>
                          <td className="border border-border p-2">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {post.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  You have no posts scheduled yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutopostingSocialMediaAgent;
