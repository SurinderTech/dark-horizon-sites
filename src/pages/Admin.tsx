
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronRight, Inbox, MessageSquare, Settings, User, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const Admin = () => {
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const messages = [
    {
      id: "msg1",
      name: "John Smith",
      email: "john.smith@example.com",
      date: "2023-06-15T10:30:00",
      subject: "Enterprise Plan Inquiry",
      status: "New",
      content: "Hello, I am interested in the Enterprise plan for my company. We have about 500 employees and need a comprehensive AI solution for customer support. Can you provide more details about customization options and implementation timeline?"
    },
    {
      id: "msg2",
      name: "Sarah Johnson",
      email: "sarah.johnson@techinnovate.com",
      date: "2023-06-14T14:45:00",
      subject: "Professional Plan Questions",
      status: "Replied",
      content: "Hi there, I have a few questions about your Professional plan. Does it include custom integrations with Salesforce? Also, what kind of training do you provide for our staff? We have a small team but need advanced capabilities."
    },
    {
      id: "msg3",
      name: "Michael Wong",
      email: "m.wong@globalretail.org",
      date: "2023-06-13T09:15:00",
      subject: "Custom Solution Request",
      status: "New",
      content: "I represent a retail chain with locations across North America. We are looking for a custom AI solution that can integrate with our existing CRM and provide multilingual support. Can we schedule a call to discuss the possibilities and pricing?"
    },
    {
      id: "msg4",
      name: "Rachel Green",
      email: "rachel.g@startupfuture.io",
      date: "2023-06-12T16:20:00",
      subject: "Starter Plan Clarification",
      status: "Resolved",
      content: "Thanks for the information about the Starter plan. I have one more question - can we upgrade to Professional mid-subscription if we find we need more features? Our startup is growing quickly and we might need to scale our AI solution accordingly."
    }
  ];

  const orders = [
    {
      id: "ord1",
      customer: "TechInnovate Solutions",
      plan: "Enterprise",
      date: "2023-06-10T09:30:00",
      amount: 14990,
      status: "Active",
      details: {
        contactName: "David Chen",
        contactEmail: "d.chen@techinnovate.com",
        contactPhone: "+1 (415) 555-7890",
        billingAddress: "123 Innovation Way, San Francisco, CA 94105",
        paymentMethod: "Credit Card (ending in 4567)",
        requirements: "Custom integration with Oracle CRM, multilingual support (8 languages), white-labeled solution",
        notes: "Priority implementation requested. Client has seasonal peak in September."
      }
    },
    {
      id: "ord2",
      customer: "Global Health Partners",
      plan: "Professional",
      date: "2023-06-08T11:15:00",
      amount: 6990,
      status: "In setup",
      details: {
        contactName: "Emily Rodriguez",
        contactEmail: "e.rodriguez@ghpartners.org",
        contactPhone: "+1 (312) 555-3232",
        billingAddress: "456 Medical Drive, Chicago, IL 60601",
        paymentMethod: "ACH Transfer",
        requirements: "HIPAA compliance required, integration with Epic Systems EHR, custom training for medical terminology",
        notes: "Sensitive data handling training needed for team."
      }
    },
    {
      id: "ord3",
      customer: "EcoRetail Stores",
      plan: "Starter",
      date: "2023-06-05T14:45:00",
      amount: 2990,
      status: "Active",
      details: {
        contactName: "Tyler James",
        contactEmail: "tjames@ecoretail.com",
        contactPhone: "+1 (206) 555-1212",
        billingAddress: "789 Sustainable Ave, Seattle, WA 98101",
        paymentMethod: "Credit Card (ending in 8901)",
        requirements: "Basic chatbot for customer inquiries, product recommendations, inventory checking",
        notes: "Interested in upgrading to Professional plan after 3 months if initial implementation is successful."
      }
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Messages Tab Content */}
          <TabsContent value="messages">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Inbox className="mr-2" />
                    Messages
                  </CardTitle>
                  <CardDescription>
                    {messages.length} total messages
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex items-center justify-between p-4 cursor-pointer border-b border-border/40 hover:bg-secondary/50 transition-colors ${activeMessageId === message.id ? 'bg-secondary/80' : ''}`}
                        onClick={() => setActiveMessageId(message.id)}
                      >
                        <div className="flex items-center">
                          <User className="h-9 w-9 text-muted-foreground bg-background p-1.5 rounded-full mr-3" />
                          <div>
                            <p className="font-medium">{message.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {message.subject}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge variant={message.status === 'New' ? 'default' : message.status === 'Replied' ? 'outline' : 'secondary'}>
                            {message.status}
                          </Badge>
                          {activeMessageId === message.id ? 
                            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" /> : 
                            <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
                          }
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                {activeMessageId ? (
                  <>
                    {(() => {
                      const message = messages.find(m => m.id === activeMessageId);
                      return (
                        <>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{message?.subject}</CardTitle>
                                <CardDescription>From {message?.name} ({message?.email})</CardDescription>
                              </div>
                              <Badge variant={message?.status === 'New' ? 'default' : message?.status === 'Replied' ? 'outline' : 'secondary'}>
                                {message?.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="whitespace-pre-line">{message?.content}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between border-t border-border/40 pt-4">
                            <div className="text-sm text-muted-foreground">
                              {new Date(message?.date || '').toLocaleString()}
                            </div>
                            <div className="flex gap-2">
                              {message?.status !== 'Resolved' && (
                                <Button variant="outline" size="sm">
                                  Mark as Resolved
                                </Button>
                              )}
                              <Button size="sm">
                                Reply
                              </Button>
                            </div>
                          </CardFooter>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <div className="h-[calc(100vh-300px)] flex flex-col items-center justify-center text-center p-6">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Select a message</h3>
                    <p className="text-muted-foreground">
                      Choose a message from the list to view its details
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab Content */}
          <TabsContent value="orders">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2" />
                    Active Orders
                  </CardTitle>
                  <CardDescription>
                    {orders.length} total orders
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {orders.map((order) => (
                      <div 
                        key={order.id}
                        className={`flex items-center justify-between p-4 cursor-pointer border-b border-border/40 hover:bg-secondary/50 transition-colors ${activeOrderId === order.id ? 'bg-secondary/80' : ''}`}
                        onClick={() => setActiveOrderId(order.id)}
                      >
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.plan} Plan
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Badge variant={order.status === 'Active' ? 'default' : 'outline'}>
                            {order.status}
                          </Badge>
                          {activeOrderId === order.id ? 
                            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" /> : 
                            <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
                          }
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                {activeOrderId ? (
                  <>
                    {(() => {
                      const order = orders.find(o => o.id === activeOrderId);
                      return (
                        <>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{order?.customer}</CardTitle>
                                <CardDescription>{order?.plan} Plan - ${order?.amount}/year</CardDescription>
                              </div>
                              <Badge variant={order?.status === 'Active' ? 'default' : 'outline'}>
                                {order?.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  <div><span className="text-muted-foreground">Name:</span> {order?.details.contactName}</div>
                                  <div><span className="text-muted-foreground">Email:</span> {order?.details.contactEmail}</div>
                                  <div><span className="text-muted-foreground">Phone:</span> {order?.details.contactPhone}</div>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <h4 className="font-medium mb-2">Billing Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  <div><span className="text-muted-foreground">Address:</span> {order?.details.billingAddress}</div>
                                  <div><span className="text-muted-foreground">Payment Method:</span> {order?.details.paymentMethod}</div>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <h4 className="font-medium mb-2">Requirements</h4>
                                <p className="text-sm">{order?.details.requirements}</p>
                              </div>
                              
                              {order?.details.notes && (
                                <>
                                  <Separator />
                                  <div>
                                    <h4 className="font-medium mb-2">Notes</h4>
                                    <p className="text-sm">{order?.details.notes}</p>
                                  </div>
                                </>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between border-t border-border/40 pt-4">
                            <div className="text-sm text-muted-foreground">
                              Order date: {new Date(order?.date || '').toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm">
                                Manage Order
                              </Button>
                            </div>
                          </CardFooter>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <div className="h-[calc(100vh-300px)] flex flex-col items-center justify-center text-center p-6">
                    <Users className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Select an order</h3>
                    <p className="text-muted-foreground">
                      Choose an order from the list to view its details
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab Content */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2" />
                  Dashboard Settings
                </CardTitle>
                <CardDescription>
                  Configure your admin dashboard preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings panel content will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
