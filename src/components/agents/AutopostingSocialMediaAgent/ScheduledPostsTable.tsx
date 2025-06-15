
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ScheduledPostsTable({ posts }: any) {
  return (
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
                {posts
                  .sort((a: any, b: any) => a.scheduled_at.getTime() - b.scheduled_at.getTime())
                  .map((post: any) => (
                    <tr key={post.id}>
                      <td className="border border-border p-2 capitalize">{post.platform}</td>
                      <td className="border border-border p-2 max-w-xs">
                        <div className="flex flex-col gap-2">
                          {post.imageUrl && (
                            <img src={post.imageUrl} alt="Generated content" className="w-24 h-24 object-cover rounded-md" />
                          )}
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
  )
}
