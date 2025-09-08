import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Check, Play, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAgents } from '@/hooks/useAgents';
import { useUserPurchases } from '@/hooks/useUserPurchases';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AIAgents = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { data: agents, isLoading: agentsLoading, error: agentsError } = useAgents();
  const { data: purchases } = useUserPurchases();
  const { user, role } = useAuth();

  const categories = [
    { id: 'all', label: 'All Agents' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'customer-service', label: 'Customer Service' },
    { id: 'data-analysis', label: 'Data Analysis' },
  ];

  if (agentsLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-20 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading AI agents...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (agentsError) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Error Loading Agents</h2>
          <p className="text-muted-foreground">Failed to load AI agents. Please try again later.</p>
        </div>
      </Layout>
    );
  }

  const filteredAgents = activeCategory === 'all' 
    ? agents || []
    : (agents || []).filter(agent => agent.category === activeCategory);

  const isAgentPurchased = (agentId: string) => {
    return purchases?.some(purchase => purchase.agent_id === agentId) || false;
  };

  const handlePurchase = (agentId: string) => {
    if (!user) {
      toast.error('Please log in to purchase an agent');
      return;
    }
    // This will be connected to Stripe later
    toast.info('Payment system coming soon!');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-primary/20 to-background">
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
            {filteredAgents.map((agent) => {
              const isPurchased = isAgentPurchased(agent.id);
              const canUseAgent = isPurchased || role === 'admin';
              
              return (
                <Card key={agent.id} className={`overflow-hidden ${agent.is_popular ? 'border-accent' : 'border-border'} ${canUseAgent ? 'bg-accent/5 border-accent' : ''}`}>
                  {agent.is_popular && !canUseAgent && (
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-sm font-medium z-10">
                      Popular
                    </div>
                  )}
                  {canUseAgent && (
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-sm font-medium z-10">
                      Owned
                    </div>
                  )}
                  <CardHeader className="p-0">
                    <div className="relative pb-[56.25%] bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                        <Play className="h-12 w-12 text-primary-foreground" />
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
                            <Check className="h-4 w-4 text-accent" />
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
                        <span className="font-semibold">${agent.monthly_price}/mo</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Annual</span>
                        <span className="font-semibold">${agent.yearly_price}/yr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Lifetime</span>
                        <span className="font-semibold">${agent.lifetime_price}</span>
                      </div>
                    </div>
                    {canUseAgent ? (
                      <Button asChild className="w-full">
                        <Link to={`/agent/${agent.id}/workspace`}>Use Agent</Link>
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => handlePurchase(agent.id)}
                      >
                        Purchase Now
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
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
          <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-secondary rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Need a Custom AI Agent?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We can build a specialized AI agent tailored to your unique business requirements.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
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
