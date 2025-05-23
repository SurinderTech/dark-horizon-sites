
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, CardHeader, CardTitle, CardDescription, 
  CardContent, CardFooter 
} from '@/components/ui/card';
import { 
  Download, PlayCircle, Settings, Users, RefreshCw, 
  CreditCard, Box, Video, Clock, AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/150',
    credits: 25,
    subscription: {
      plan: 'Professional',
      renewDate: '2024-06-15',
      status: 'active'
    }
  };

  // Mock purchased agents
  const purchasedAgents = [
    {
      id: 1,
      name: 'Food Order Assistant',
      purchaseDate: '2024-05-10',
      licenseType: 'Monthly Subscription',
      status: 'active',
      nextBilling: '2024-06-10',
      category: 'customer-service'
    },
    {
      id: 2,
      name: 'Social Media Manager',
      purchaseDate: '2024-04-22',
      licenseType: 'Lifetime License',
      status: 'active',
      category: 'marketing'
    }
  ];

  // Mock generated ads
  const generatedAds = [
    {
      id: 1,
      name: 'Summer Collection Ad',
      template: 'Fashion Lookbook',
      dateCreated: '2024-05-18',
      thumbnail: 'https://via.placeholder.com/300x200/0f172a/ffffff?text=Fashion+Ad'
    },
    {
      id: 2,
      name: 'Product Launch',
      template: 'Tech Product Launch',
      dateCreated: '2024-05-15',
      thumbnail: 'https://via.placeholder.com/300x200/0f172a/ffffff?text=Tech+Launch'
    },
    {
      id: 3,
      name: 'Service Promotion',
      template: 'Service Explainer',
      dateCreated: '2024-05-12',
      thumbnail: 'https://via.placeholder.com/300x200/0f172a/ffffff?text=Service+Ad'
    }
  ];

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'purchase',
      description: 'Purchased Food Order Assistant',
      date: '2024-05-10 14:23'
    },
    {
      id: 2,
      type: 'generation',
      description: 'Generated "Summer Collection Ad"',
      date: '2024-05-18 09:45'
    },
    {
      id: 3,
      type: 'account',
      description: 'Updated account information',
      date: '2024-05-05 16:30'
    },
    {
      id: 4,
      type: 'subscription',
      description: 'Renewed Professional subscription',
      date: '2024-05-01 00:00'
    }
  ];

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      {/* Dashboard Header */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-tech-blue to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-tech-purple/20 border-2 border-tech-cyan flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-8 h-8 text-tech-cyan" />
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="outline" 
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button asChild variant="default">
                <a href="/account">Account Settings</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Overview Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Subscription</CardTitle>
                <CardDescription>Your current plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">{user.subscription.plan}</p>
                    <p className="text-sm text-muted-foreground">Renews on {user.subscription.renewDate}</p>
                  </div>
                  <div className="px-2 py-1 bg-green-500/20 text-green-500 rounded-md text-xs font-medium">
                    {user.subscription.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Subscription
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">AI Agents</CardTitle>
                <CardDescription>Your purchased agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">{purchasedAgents.length}</p>
                    <p className="text-sm text-muted-foreground">Active licenses</p>
                  </div>
                  <Box className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Agents
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Template Credits</CardTitle>
                <CardDescription>For CGI ad generation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">{user.credits}</p>
                    <p className="text-sm text-muted-foreground">Remaining credits</p>
                  </div>
                  <Video className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Purchase Credits
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ai-agents">AI Agents</TabsTrigger>
              <TabsTrigger value="cgi-ads">CGI Ads</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest actions and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {recentActivities.map(activity => (
                          <div key={activity.id} className="flex gap-4 items-start">
                            <div className="p-2 rounded-full bg-muted">
                              {activity.type === 'purchase' && <CreditCard className="h-5 w-5" />}
                              {activity.type === 'generation' && <Video className="h-5 w-5" />}
                              {activity.type === 'account' && <Settings className="h-5 w-5" />}
                              {activity.type === 'subscription' && <RefreshCw className="h-5 w-5" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{activity.description}</p>
                              <p className="text-sm text-muted-foreground">{activity.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Notifications */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Updates and alerts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/10">
                          <div className="flex gap-3 items-start">
                            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="font-medium">New AI Agent Available</p>
                              <p className="text-sm text-muted-foreground">Check out our latest Customer Support agent.</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg border border-tech-cyan/20 bg-tech-cyan/10">
                          <div className="flex gap-3 items-start">
                            <Clock className="h-5 w-5 text-tech-cyan mt-0.5" />
                            <div>
                              <p className="font-medium">Subscription Renewal</p>
                              <p className="text-sm text-muted-foreground">Your subscription will renew in 15 days.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* AI Agents Tab */}
            <TabsContent value="ai-agents">
              <div className="space-y-6">
                <SectionHeader
                  title="Your AI Agents"
                  description="Manage your purchased AI agents and subscriptions"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {purchasedAgents.map(agent => (
                    <Card key={agent.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{agent.name}</CardTitle>
                            <CardDescription>
                              {agent.licenseType} • Purchased on {agent.purchaseDate}
                            </CardDescription>
                          </div>
                          <div className="px-2 py-1 bg-green-500/20 text-green-500 rounded-md text-xs font-medium">
                            {agent.status}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Category</span>
                            <span>{agent.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          </div>
                          {agent.licenseType.includes('Monthly') && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Next billing</span>
                              <span>{agent.nextBilling}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-3">
                        <Button variant="default" className="flex-1">Access Agent</Button>
                        <Button variant="outline">Settings</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <div className="text-center py-8">
                  <Button asChild variant="outline" size="lg">
                    <a href="/ai-agents">Browse More Agents</a>
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* CGI Ads Tab */}
            <TabsContent value="cgi-ads">
              <div className="space-y-6">
                <SectionHeader
                  title="Your CGI Ads"
                  description="Access and manage your generated CGI advertisements"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {generatedAds.map(ad => (
                    <Card key={ad.id} className="overflow-hidden">
                      <CardHeader className="p-0">
                        <div className="relative h-40">
                          <img 
                            src={ad.thumbnail} 
                            alt={ad.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <div>
                              <h3 className="text-lg font-medium text-white">{ad.name}</h3>
                              <p className="text-xs text-white/80">Created on {ad.dateCreated}</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Template: {ad.template}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <div className="text-center py-8">
                  <Button asChild variant="outline" size="lg">
                    <a href="/cgi-templates">Create New Ad</a>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
