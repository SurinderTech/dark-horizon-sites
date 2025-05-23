
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Check, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIAgents = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Agents' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'customer-service', label: 'Customer Service' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'data-analysis', label: 'Data Analysis' },
  ];

  const agents = [
    {
      id: 1,
      name: 'Food Order Assistant',
      category: 'customer-service',
      description: 'Streamline food ordering process for your restaurant with an AI assistant that handles orders with precision.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      monthlyPrice: 49,
      yearlyPrice: 490,
      lifetimePrice: 990,
      features: [
        'Natural language order processing',
        'Integration with food delivery platforms',
        'Custom menu management',
        'Order confirmation and tracking',
        'Customer preference learning',
      ],
      popular: true,
    },
    {
      id: 2,
      name: 'Social Media Manager',
      category: 'marketing',
      description: 'AI-powered social media management that creates, schedules, and analyzes your content across platforms.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      monthlyPrice: 79,
      yearlyPrice: 790,
      lifetimePrice: 1490,
      features: [
        'Content generation based on your brand',
        'Automated posting schedule',
        'Engagement analysis',
        'Competitor tracking',
        'Trending topics identification',
      ],
      popular: false,
    },
    {
      id: 3,
      name: 'Data Analysis Assistant',
      category: 'data-analysis',
      description: 'Transform raw data into actionable insights with our intelligent data analysis agent.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      monthlyPrice: 99,
      yearlyPrice: 990,
      lifetimePrice: 1990,
      features: [
        'Automated data cleaning',
        'Pattern recognition',
        'Custom report generation',
        'Predictive analysis',
        'Integration with popular data sources',
      ],
      popular: false,
    },
    {
      id: 4,
      name: 'Meeting Assistant',
      category: 'productivity',
      description: 'Never miss important details again with this AI meeting assistant that transcribes, summarizes, and extracts action items.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      monthlyPrice: 59,
      yearlyPrice: 590,
      lifetimePrice: 1190,
      features: [
        'Real-time meeting transcription',
        'Action item extraction',
        'Meeting summarization',
        'Calendar integration',
        'Follow-up reminder generation',
      ],
      popular: true,
    },
  ];

  const filteredAgents = activeCategory === 'all' 
    ? agents 
    : agents.filter(agent => agent.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-tech-blue to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Intelligent <span className="text-gradient">AI Agents</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Purpose-built AI assistants designed to automate and enhance your business processes.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className="transition-all"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className={`overflow-hidden ${agent.popular ? 'border-tech-cyan' : 'border-border'}`}>
                {agent.popular && (
                  <div className="absolute top-0 right-0 bg-tech-cyan text-white px-4 py-1 text-sm font-medium z-10">
                    Popular
                  </div>
                )}
                <CardHeader className="p-0">
                  <div className="relative pb-[56.25%] bg-muted">
                    <iframe
                      src={agent.videoUrl}
                      className="absolute inset-0 w-full h-full"
                      title={agent.name}
                      allowFullScreen
                    ></iframe>
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40">
                        <Play className="h-6 w-6 fill-white text-white" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl mb-2">{agent.name}</CardTitle>
                  <CardDescription className="mb-4">{agent.description}</CardDescription>
                  <div className="space-y-2 mt-4">
                    {agent.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="mr-3 mt-1">
                          <Check className="h-4 w-4 text-tech-cyan" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {agent.features.length > 3 && (
                      <p className="text-sm text-muted-foreground pl-7">
                        +{agent.features.length - 3} more features
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex flex-col gap-4">
                  <div className="w-full flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly</span>
                      <span className="font-semibold">${agent.monthlyPrice}/mo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Annual</span>
                      <span className="font-semibold">${agent.yearlyPrice}/yr</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lifetime</span>
                      <span className="font-semibold">${agent.lifetimePrice}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full bg-blue-purple hover:brightness-110 transition-all">
                    <Link to={`/agent/${agent.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredAgents.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">No agents found</h3>
              <p className="text-muted-foreground">
                We couldn't find any AI agents matching your selected category. 
                Please try a different category or check back later.
              </p>
              <Button 
                className="mt-6" 
                onClick={() => setActiveCategory('all')}
              >
                View All Agents
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-tech-blue via-tech-electric/20 to-tech-purple/20 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Need a Custom AI Agent?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We can build a specialized AI agent tailored to your unique business requirements.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-blue-purple hover:brightness-110 transition-all">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AIAgents;
