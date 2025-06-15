
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
import { Calendar, Clock, Send, List, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  platforms: z.array(z.string()).nonempty({
    message: 'Please select at least one platform.',
  }),
  content: z.string().min(1, 'Content cannot be empty.'),
  date: z.string().min(1, 'Please select a date.'),
  time: z.string().min(1, 'Please select a time.'),
});

const platformOptions = [
    { id: 'Facebook', label: 'Facebook', icon: Facebook },
    { id: 'Twitter', label: 'Twitter', icon: Twitter },
    { id: 'LinkedIn', label: 'LinkedIn', icon: Linkedin },
    { id: 'Instagram', label: 'Instagram', icon: Instagram },
];

const AutopostingSocialMediaAgent = ({ agent }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platforms: [],
      content: '',
      date: '',
      time: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const scheduled_at = new Date(`${values.date}T${values.time}`);
    const newPosts = values.platforms.map((platform) => ({
      id: Date.now() + Math.random(),
      platform,
      content: values.content,
      date: values.date,
      time: values.time,
      status: 'Scheduled',
      scheduled_at,
    }));

    // Simulate API call
    setTimeout(() => {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      toast.success(`Posts scheduled for ${values.platforms.join(', ')} successfully!`);
      form.reset();
      setLoading(false);
    }, 1500);
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
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea placeholder="What's on your mind?" {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
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
                    {loading ? 'Scheduling...' : 'Schedule Post'}
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
                      {posts.sort((a, b) => a.scheduled_at - b.scheduled_at).map((post) => (
                        <tr key={post.id}>
                          <td className="border border-border p-2 capitalize">{post.platform}</td>
                          <td className="border border-border p-2 max-w-xs truncate">{post.content}</td>
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
