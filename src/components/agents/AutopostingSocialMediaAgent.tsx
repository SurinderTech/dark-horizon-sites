
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SchedulePostForm from './AutopostingSocialMediaAgent/SchedulePostForm';
import ScheduledPostsTable from './AutopostingSocialMediaAgent/ScheduledPostsTable';
import { Send, List } from 'lucide-react';

const AutopostingSocialMediaAgent = ({ agent }) => {
  const [posts, setPosts] = useState<any[]>([]);

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
          <SchedulePostForm onPostsScheduled={(newPosts: any[]) => setPosts((prev) => [...prev, ...newPosts].sort((a, b) => a.scheduled_at.getTime() - b.scheduled_at.getTime()))} />
        </TabsContent>
        <TabsContent value="posts">
          <ScheduledPostsTable posts={posts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutopostingSocialMediaAgent;
