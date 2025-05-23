
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ArrowLeft, Play } from 'lucide-react';

// This would ideally come from a database/API
const agentsData = [
  {
    id: 1,
    name: 'Food Order Assistant',
    category: 'customer-service',
    description: 'Streamline food ordering process for your restaurant with an AI assistant that handles orders with precision.',
    longDescription: 'Our Food Order Assistant is designed to revolutionize how restaurants handle online orders. It uses natural language processing to understand customer requests, manage modifications, and ensure accurate order placement. The system integrates seamlessly with your existing POS and food delivery platforms.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    demoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    monthlyPrice: 49,
    yearlyPrice: 490,
    lifetimePrice: 990,
    features: [
      'Natural language order processing',
      'Integration with food delivery platforms',
      'Custom menu management',
      'Order confirmation and tracking',
      'Customer preference learning',
      'Multi-language support',
      'Voice recognition capability',
      'Customizable responses',
      'Analytics dashboard',
      'Weekly performance reports'
    ],
    useCases: [
      'Restaurant chains looking to streamline online ordering',
      'Food delivery services wanting to improve order accuracy',
      'Ghost kitchens managing multiple delivery platforms',
      'Cafes seeking to reduce staff workload during peak hours'
    ],
    techSpecs: {
      apiIntegration: 'REST API, Webhooks',
      dataProcessing: 'Real-time',
      deployment: 'Cloud-based, On-premise optional',
      security: 'Enterprise-grade encryption',
      uptime: '99.9% guaranteed'
    },
    popular: true,
  },
  {
    id: 2,
    name: 'Social Media Manager',
    category: 'marketing',
    description: 'AI-powered social media management that creates, schedules, and analyzes your content across platforms.',
    longDescription: 'The Social Media Manager AI agent takes the guesswork out of social media marketing. It analyzes your brand voice, audience preferences, and industry trends to generate engaging content. The system handles scheduling, posting, engagement tracking, and performance analysis across all major platforms.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    demoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    monthlyPrice: 79,
    yearlyPrice: 790,
    lifetimePrice: 1490,
    features: [
      'Content generation based on your brand',
      'Automated posting schedule',
      'Engagement analysis',
      'Competitor tracking',
      'Trending topics identification',
      'Multi-platform support',
      'AI-driven hashtag optimization',
      'Audience growth metrics',
      'Content performance forecasting',
      'Custom reporting'
    ],
    useCases: [
      'Small businesses with limited marketing staff',
      'Influencers managing multiple social accounts',
      'Marketing agencies handling multiple client accounts',
      'E-commerce businesses promoting products across platforms'
    ],
    techSpecs: {
      apiIntegration: 'Native integrations with all major social platforms',
      dataProcessing: 'Real-time with historical analysis',
      deployment: 'Cloud-based SaaS',
      security: 'OAuth 2.0 authentication',
      uptime: '99.9% guaranteed'
    },
    popular: false,
  },
  {
    id: 3,
    name: 'Data Analysis Assistant',
    category: 'data-analysis',
    description: 'Transform raw data into actionable insights with our intelligent data analysis agent.',
    longDescription: 'The Data Analysis Assistant leverages advanced machine learning algorithms to process large datasets and extract meaningful patterns and insights. It automates the entire data pipeline from cleaning and normalization to visualization and report generation, saving your team countless hours of manual analysis.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    demoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    monthlyPrice: 99,
    yearlyPrice: 990,
    lifetimePrice: 1990,
    features: [
      'Automated data cleaning',
      'Pattern recognition',
      'Custom report generation',
      'Predictive analysis',
      'Integration with popular data sources',
      'Anomaly detection',
      'Trend forecasting',
      'Interactive dashboards',
      'Export to multiple formats',
      'Scheduled reporting'
    ],
    useCases: [
      'Business intelligence teams seeking automation',
      'Financial institutions analyzing market trends',
      'E-commerce businesses optimizing inventory',
      'Healthcare organizations processing patient data'
    ],
    techSpecs: {
      apiIntegration: 'REST API, Direct database connections',
      dataProcessing: 'Batch and real-time processing',
      deployment: 'Cloud or on-premise',
      security: 'End-to-end encryption, HIPAA compliant',
      uptime: '99.9% guaranteed'
    },
    popular: false,
  },
  {
    id: 4,
    name: 'Meeting Assistant',
    category: 'productivity',
    description: 'Never miss important details again with this AI meeting assistant that transcribes, summarizes, and extracts action items.',
    longDescription: 'Our Meeting Assistant is like having a dedicated secretary in every meeting. It actively listens to conversations, transcribes everything in real-time, identifies key discussion points, and extracts action items with assigned owners. After the meeting, it sends a comprehensive summary to all participants, ensuring everyone stays on the same page.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    demoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    monthlyPrice: 59,
    yearlyPrice: 590,
    lifetimePrice: 1190,
    features: [
      'Real-time meeting transcription',
      'Action item extraction',
      'Meeting summarization',
      'Calendar integration',
      'Follow-up reminder generation',
      'Voice recognition for multiple speakers',
      'Integration with project management tools',
      'Searchable meeting archive',
      'Sentiment analysis',
      'Meeting effectiveness metrics'
    ],
    useCases: [
      'Executive teams with packed meeting schedules',
      'Project managers coordinating multiple workstreams',
      'Remote teams needing better documentation',
      'Customer service teams handling client calls'
    ],
    techSpecs: {
      apiIntegration: 'Calendar APIs, Project management tools',
      dataProcessing: 'Real-time transcription and analysis',
      deployment: 'Cloud-based SaaS with desktop/mobile apps',
      security: 'Enterprise-grade encryption, GDPR compliant',
      uptime: '99.9% guaranteed'
    },
    popular: true,
  },
];

const AgentDetail = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState<any>(null);
  const [selectedPricing, setSelectedPricing] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');

  useEffect(() => {
    // In a real app, this would be an API call to fetch agent details
    const foundAgent = agentsData.find(a => a.id.toString() === id);
    setAgent(foundAgent);
  }, [id]);

  if (!agent) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col items-center">
          <h2 className="text-2xl font-bold">Agent not found</h2>
          <p className="mt-4 text-muted-foreground">The agent you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-8">
            <Link to="/ai-agents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to AI Agents
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const getCurrentPrice = () => {
    switch (selectedPricing) {
      case 'monthly': return agent.monthlyPrice;
      case 'yearly': return agent.yearlyPrice;
      case 'lifetime': return agent.lifetimePrice;
      default: return agent.monthlyPrice;
    }
  };

  const handlePurchase = () => {
    // This would redirect to login/signup if not authenticated
    // Then handle payment process
    alert('This would redirect to login/payment flow in a complete implementation');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Breadcrumb / Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0">
            <Link to="/ai-agents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to AI Agents
            </Link>
          </Button>
        </div>

        {/* Agent Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{agent.name}</h1>
            <p className="text-xl text-muted-foreground mb-6">{agent.longDescription}</p>
            <div className="space-y-4">
              {agent.features.slice(0, 5).map((feature: string, index: number) => (
                <div key={index} className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Check className="h-5 w-5 text-tech-cyan" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/40 rounded-xl overflow-hidden">
            <div className="relative pb-[56.25%]">
              <iframe
                src={agent.videoUrl}
                className="absolute inset-0 w-full h-full"
                title={`${agent.name} demo`}
                allowFullScreen
              ></iframe>
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40">
                  <Play className="h-6 w-6 fill-white text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing and Purchase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Detailed Features</h2>
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
                <TabsTrigger value="tech-specs">Tech Specs</TabsTrigger>
                <TabsTrigger value="demo">Live Demo</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="space-y-4">
                {agent.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-3 mt-1">
                      <Check className="h-5 w-5 text-tech-cyan" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="use-cases">
                <ul className="space-y-4">
                  {agent.useCases.map((useCase: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1">
                        <Check className="h-5 w-5 text-tech-cyan" />
                      </div>
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="tech-specs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(agent.techSpecs).map(([key, value]: [string, any]) => (
                    <Card key={key} className="border-border/40">
                      <CardContent className="p-4">
                        <div className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                        <div className="text-muted-foreground">{value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="demo" className="min-h-[300px]">
                <div className="bg-muted/40 rounded-xl overflow-hidden">
                  <div className="relative pb-[56.25%]">
                    <iframe
                      src={agent.demoUrl}
                      className="absolute inset-0 w-full h-full"
                      title={`${agent.name} interactive demo`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  This interactive demo shows the {agent.name} in action. Try it out to see how it would work for your business.
                </p>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className={`overflow-hidden ${agent.popular ? 'border-tech-cyan' : 'border-border'}`}>
              {agent.popular && (
                <div className="bg-tech-cyan text-white px-4 py-1 text-sm font-medium text-center">
                  Popular Choice
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Purchase Options</h3>
                
                <div className="space-y-4 mb-6">
                  <div 
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${selectedPricing === 'monthly' ? 'bg-tech-cyan/10 border border-tech-cyan' : 'border border-border hover:border-tech-cyan/50'}`}
                    onClick={() => setSelectedPricing('monthly')}
                  >
                    <div>
                      <div className="font-semibold">Monthly</div>
                      <div className="text-sm text-muted-foreground">Billed monthly</div>
                    </div>
                    <div className="font-bold">${agent.monthlyPrice}/mo</div>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${selectedPricing === 'yearly' ? 'bg-tech-cyan/10 border border-tech-cyan' : 'border border-border hover:border-tech-cyan/50'}`}
                    onClick={() => setSelectedPricing('yearly')}
                  >
                    <div>
                      <div className="font-semibold">Annual</div>
                      <div className="text-sm text-muted-foreground">Save 15%</div>
                    </div>
                    <div className="font-bold">${agent.yearlyPrice}/yr</div>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${selectedPricing === 'lifetime' ? 'bg-tech-cyan/10 border border-tech-cyan' : 'border border-border hover:border-tech-cyan/50'}`}
                    onClick={() => setSelectedPricing('lifetime')}
                  >
                    <div>
                      <div className="font-semibold">Lifetime</div>
                      <div className="text-sm text-muted-foreground">One-time payment</div>
                    </div>
                    <div className="font-bold">${agent.lifetimePrice}</div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Selected plan:</div>
                    <div className="text-3xl font-bold">${getCurrentPrice()}</div>
                    {selectedPricing !== 'lifetime' && (
                      <div className="text-sm text-muted-foreground">
                        {selectedPricing === 'monthly' ? 'per month' : 'per year'}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-purple hover:brightness-110 transition-all"
                    onClick={handlePurchase}
                  >
                    Purchase Now
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Secure payment. 14-day money-back guarantee.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Related Agents */}
        <div>
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agentsData
              .filter(a => a.id !== agent.id)
              .slice(0, 3)
              .map((relatedAgent) => (
                <Card key={relatedAgent.id} className="overflow-hidden border-border/40">
                  <div className="p-0">
                    <div className="relative pb-[56.25%] bg-muted">
                      <iframe
                        src={relatedAgent.videoUrl}
                        className="absolute inset-0 w-full h-full"
                        title={relatedAgent.name}
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{relatedAgent.name}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{relatedAgent.description}</p>
                    <Button asChild className="w-full">
                      <Link to={`/agent/${relatedAgent.id}`}>View Details</Link>
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgentDetail;
