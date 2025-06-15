
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ArrowLeft, Play, Loader2 } from 'lucide-react';
import { useAgents, Agent } from '@/hooks/useAgents';
import { useUserPurchases } from '@/hooks/useUserPurchases';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AgentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: agents, isLoading } = useAgents();
  const { data: purchases } = useUserPurchases();
  const { user, role } = useAuth();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');

  useEffect(() => {
    if (agents && id) {
      const foundAgent = agents.find(a => a.id === id);
      setAgent(foundAgent || null);
    }
  }, [agents, id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-12 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading agent details...</span>
          </div>
        </div>
      </Layout>
    );
  }

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

  const isPurchased = purchases?.some(purchase => purchase.agent_id === agent.id) || false;
  const canUseAgent = isPurchased || role === 'admin';

  const getCurrentPrice = () => {
    switch (selectedPricing) {
      case 'monthly': return agent.monthly_price;
      case 'yearly': return agent.yearly_price;
      case 'lifetime': return agent.lifetime_price;
      default: return agent.monthly_price;
    }
  };

  const handlePurchase = () => {
    if (!user) {
      toast.error('Please log in to purchase this agent');
      navigate('/auth');
      return;
    }
    // This will be connected to Stripe later
    toast.info('Payment system coming soon!');
  };

  const handleUseAgent = () => {
    if (!canUseAgent) {
      toast.error('Please purchase this agent first');
      return;
    }
    // Navigate to agent workspace
    navigate(`/agent/${agent.id}/workspace`);
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
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold">{agent.name}</h1>
              {canUseAgent && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Owned
                </span>
              )}
            </div>
            <p className="text-xl text-muted-foreground mb-6">{agent.description}</p>
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
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-tech-blue to-tech-purple">
                <Play className="h-16 w-16 text-white" />
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
                <TabsTrigger value="demo">Demo</TabsTrigger>
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
              
              <TabsContent value="demo" className="min-h-[300px]">
                <div className="bg-muted/40 rounded-xl overflow-hidden">
                  <div className="relative pb-[56.25%]">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-tech-blue to-tech-purple">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  This demo shows the {agent.name} in action. {canUseAgent ? 'You can access the full functionality in your workspace.' : 'Purchase to unlock full functionality.'}
                </p>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className={`overflow-hidden ${agent.is_popular ? 'border-tech-cyan' : 'border-border'} ${canUseAgent ? 'bg-green-50 border-green-500' : ''}`}>
              {agent.is_popular && !canUseAgent && (
                <div className="bg-tech-cyan text-white px-4 py-1 text-sm font-medium text-center">
                  Popular Choice
                </div>
              )}
              {canUseAgent && (
                <div className="bg-green-500 text-white px-4 py-1 text-sm font-medium text-center">
                  You Own This Agent
                </div>
              )}
              <div className="p-6">
                {canUseAgent ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-green-600 mb-2">Agent Activated</h3>
                      <p className="text-muted-foreground">You can now use this agent</p>
                    </div>
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={handleUseAgent}
                    >
                      Open Agent Workspace
                    </Button>
                  </div>
                ) : (
                  <>
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
                        <div className="font-bold">${agent.monthly_price}/mo</div>
                      </div>
                      
                      <div 
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${selectedPricing === 'yearly' ? 'bg-tech-cyan/10 border border-tech-cyan' : 'border border-border hover:border-tech-cyan/50'}`}
                        onClick={() => setSelectedPricing('yearly')}
                      >
                        <div>
                          <div className="font-semibold">Annual</div>
                          <div className="text-sm text-muted-foreground">Save 15%</div>
                        </div>
                        <div className="font-bold">${agent.yearly_price}/yr</div>
                      </div>
                      
                      <div 
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${selectedPricing === 'lifetime' ? 'bg-tech-cyan/10 border border-tech-cyan' : 'border border-border hover:border-tech-cyan/50'}`}
                        onClick={() => setSelectedPricing('lifetime')}
                      >
                        <div>
                          <div className="font-semibold">Lifetime</div>
                          <div className="text-sm text-muted-foreground">One-time payment</div>
                        </div>
                        <div className="font-bold">${agent.lifetime_price}</div>
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
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgentDetail;
