
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { SectionHeader } from '@/components/ui/section-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Search, X, Mail, User, Calendar, DollarSign, Menu } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const AdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mock orders and messages data
  const messages = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      subject: 'AI Agent Inquiry',
      message: 'I'm interested in implementing an AI agent for our customer service team. Can you provide more details about the implementation process and timeline?',
      date: '2023-05-20T14:30:00Z',
      read: false,
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@techfirm.com',
      subject: 'Custom Tool Question',
      message: 'We need a custom AI tool for data analysis in our marketing department. What kind of data would you need from us to get started?',
      date: '2023-05-19T10:15:00Z',
      read: true,
    },
    {
      id: 3,
      name: 'Jessica Rodriguez',
      email: 'j.rodriguez@retailgroup.com',
      subject: 'Pricing Plan Question',
      message: 'I'm considering the Professional plan for our e-commerce site. Does this plan include multiple language support for the chatbot?',
      date: '2023-05-18T16:45:00Z',
      read: false,
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'dwilson@healthcare.org',
      subject: 'Healthcare AI Integration',
      message: 'We're a healthcare provider looking to implement AI solutions for patient scheduling and FAQs. Do you have experience in the healthcare sector?',
      date: '2023-05-17T09:30:00Z',
      read: true,
    },
    {
      id: 5,
      name: 'Emma Thompson',
      email: 'emma.t@edutech.com',
      subject: 'Educational AI Tools',
      message: 'Our educational technology company is interested in AI tools for student engagement. Can we schedule a demo of your solutions?',
      date: '2023-05-16T13:20:00Z',
      read: false,
    },
  ];

  const orders = [
    {
      id: 'ORD-2023-001',
      customer: 'Tech Solutions Inc.',
      email: 'orders@techsolutions.com',
      date: '2023-05-20T15:30:00Z',
      service: 'AI Agent Development',
      plan: 'Professional',
      amount: 699,
      status: 'Completed',
    },
    {
      id: 'ORD-2023-002',
      customer: 'Global Retail Group',
      email: 'tech@globalretail.com',
      date: '2023-05-19T11:45:00Z',
      service: 'Chatbot Setup',
      plan: 'Enterprise',
      amount: 1499,
      status: 'In Progress',
    },
    {
      id: 'ORD-2023-003',
      customer: 'Healthcare Plus',
      email: 'it@healthcareplus.org',
      date: '2023-05-18T09:15:00Z',
      service: 'Custom Analytics Tool',
      plan: 'Professional',
      amount: 699,
      status: 'Pending',
    },
    {
      id: 'ORD-2023-004',
      customer: 'EduTech Solutions',
      email: 'admin@edutech.com',
      date: '2023-05-17T14:20:00Z',
      service: 'AI Agent Development',
      plan: 'Starter',
      amount: 299,
      status: 'Completed',
    },
    {
      id: 'ORD-2023-005',
      customer: 'Finance Partners LLC',
      email: 'tech@financepartners.com',
      date: '2023-05-16T16:30:00Z',
      service: 'Custom Dashboard Tool',
      plan: 'Enterprise',
      amount: 1499,
      status: 'In Progress',
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication (in a real app, this would be more secure)
    if (username === 'admin' && password === 'admin123') {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials. Try admin/admin123');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Dashboard statistics
  const stats = [
    {
      title: 'Total Orders',
      value: '32',
      icon: <DollarSign className="h-5 w-5" />,
      change: '+12% from last month',
      positive: true,
    },
    {
      title: 'New Messages',
      value: '15',
      icon: <Mail className="h-5 w-5" />,
      change: '+5 since yesterday',
      positive: true,
    },
    {
      title: 'Active Customers',
      value: '143',
      icon: <User className="h-5 w-5" />,
      change: '+22% from last month',
      positive: true,
    },
    {
      title: 'Renewal Rate',
      value: '94%',
      icon: <Calendar className="h-5 w-5" />,
      change: '-2% from last month',
      positive: false,
    },
  ];

  return (
    <Layout>
      <section className="py-20 md:py-28 bg-gradient-to-b from-tech-blue to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your orders and messages in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4 md:px-6">
          {!authenticated ? (
            <div className="max-w-md mx-auto bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-md text-center text-red-500">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-blue-purple hover:brightness-110 transition-all">
                  Login
                </Button>
              </form>
              
              <p className="text-center text-sm text-muted-foreground mt-4">
                Demo credentials: admin / admin123
              </p>
            </div>
          ) : (
            <div>
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-card/60 backdrop-blur-sm border border-border/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <div className="w-8 h-8 bg-blue-purple/20 rounded-lg flex items-center justify-center text-primary">
                        {stat.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className={`text-xs ${stat.positive ? 'text-green-500' : 'text-red-500'} flex items-center mt-1`}>
                        {stat.positive ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586V7a1 1 0 012 0v5a1 1 0 01-1 1h-5z" clipRule="evenodd" />
                          </svg>
                        )}
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Dashboard Content */}
              <Tabs defaultValue="orders">
                <TabsList className="grid grid-cols-2 mb-8 bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg p-1">
                  <TabsTrigger value="orders" className="data-[state=active]:bg-blue-purple data-[state=active]:text-white">
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="data-[state=active]:bg-blue-purple data-[state=active]:text-white">
                    Messages
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="orders" className="animate-fade-in">
                  <Card className="bg-card/60 backdrop-blur-sm border border-border/40">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        <div className="flex items-center w-full max-w-xs">
                          <Input placeholder="Search orders..." className="mr-2" />
                          <Button size="icon" variant="ghost">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border/40">
                              <th className="text-left py-3 px-4 font-medium">Order ID</th>
                              <th className="text-left py-3 px-4 font-medium">Customer</th>
                              <th className="text-left py-3 px-4 font-medium">Service</th>
                              <th className="text-left py-3 px-4 font-medium">Amount</th>
                              <th className="text-left py-3 px-4 font-medium">Date</th>
                              <th className="text-left py-3 px-4 font-medium">Status</th>
                              <th className="text-right py-3 px-4 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order.id} className="border-b border-border/40 hover:bg-background/30">
                                <td className="py-3 px-4">{order.id}</td>
                                <td className="py-3 px-4">
                                  <div>
                                    <p>{order.customer}</p>
                                    <p className="text-muted-foreground text-xs">{order.email}</p>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div>
                                    <p>{order.service}</p>
                                    <p className="text-muted-foreground text-xs">{order.plan} Plan</p>
                                  </div>
                                </td>
                                <td className="py-3 px-4">${order.amount}</td>
                                <td className="py-3 px-4">{formatDate(order.date)}</td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    order.status === 'Completed' 
                                      ? 'bg-green-500/20 text-green-500' 
                                      : order.status === 'In Progress' 
                                      ? 'bg-blue-500/20 text-blue-500' 
                                      : 'bg-yellow-500/20 text-yellow-500'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <Button size="sm" variant="outline">View</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t border-border/40 py-4">
                      <p className="text-sm text-muted-foreground">
                        Showing 5 of 32 orders
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm">
                          Next
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="messages" className="animate-fade-in">
                  <Card className="bg-card/60 backdrop-blur-sm border border-border/40">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Messages</CardTitle>
                        <div className="flex items-center w-full max-w-xs">
                          <Input placeholder="Search messages..." className="mr-2" />
                          <Button size="icon" variant="ghost">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`p-4 border ${message.read ? 'border-border/40 bg-card/40' : 'border-tech-cyan/30 bg-tech-cyan/5'} rounded-lg`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-purple/50 flex items-center justify-center mr-3">
                                  <span className="font-medium text-sm">{message.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <h3 className="font-medium">{message.name}</h3>
                                  <p className="text-sm text-muted-foreground">{message.email}</p>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(message.date)}
                              </div>
                            </div>
                            <h4 className="font-medium mb-2">{message.subject}</h4>
                            <p className="text-muted-foreground text-sm mb-4">{message.message}</p>
                            <div className="flex justify-end space-x-2">
                              <Button size="sm" variant="outline">Reply</Button>
                              {message.read ? (
                                <Button size="sm" variant="ghost" className="text-muted-foreground">
                                  <Check className="h-4 w-4 mr-1" /> Read
                                </Button>
                              ) : (
                                <Button size="sm" variant="ghost" className="text-tech-cyan">
                                  Mark as Read
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t border-border/40 py-4">
                      <p className="text-sm text-muted-foreground">
                        Showing 5 of 15 messages
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm">
                          Next
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
