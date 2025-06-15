
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAgents } from '@/hooks/useAgents';
import { useUserPurchases } from '@/hooks/useUserPurchases';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Import agent workspace components
import GoogleSheetsAgent from '@/components/agents/GoogleSheetsAgent';
import FoodOrderingAgent from '@/components/agents/FoodOrderingAgent';
import EmailScraperAgent from '@/components/agents/EmailScraperAgent';
import JobsProviderAgent from '@/components/agents/JobsProviderAgent';
import InternshipsProviderAgent from '@/components/agents/InternshipsProviderAgent';
import DataAutomationAgent from '@/components/agents/DataAutomationAgent';

const AgentWorkspace = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const { data: purchases, isLoading: purchasesLoading } = useUserPurchases();
  const [agent, setAgent] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    if (agents && purchases && id) {
      const foundAgent = agents.find(a => a.id === id);
      const purchased = purchases.some(purchase => purchase.agent_id === id);
      
      setAgent(foundAgent);
      setIsPurchased(purchased);
      
      if (foundAgent && !purchased) {
        toast.error('You need to purchase this agent first');
      }
    }
  }, [agents, purchases, id]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (agentsLoading || purchasesLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading agent workspace...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!agent) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold">Agent not found</h2>
          <p className="mt-4 text-muted-foreground">The agent workspace you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  if (!isPurchased) {
    return <Navigate to={`/agent/${id}`} replace />;
  }

  const renderAgentWorkspace = () => {
    switch (agent.name) {
      case 'Google Sheets Automation Agent':
        return <GoogleSheetsAgent agent={agent} />;
      case 'Auto Food Ordering Agent':
        return <FoodOrderingAgent agent={agent} />;
      case 'Email Scraper Agent':
        return <EmailScraperAgent agent={agent} />;
      case 'Jobs Provider Agent':
        return <JobsProviderAgent agent={agent} />;
      case 'Internships Provider Agent':
        return <InternshipsProviderAgent agent={agent} />;
      case 'Data Automation Agent':
        return <DataAutomationAgent agent={agent} />;
      default:
        return (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold">Workspace Coming Soon</h3>
            <p className="text-muted-foreground mt-2">This agent workspace is under development.</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{agent.name}</h1>
          <p className="text-muted-foreground mt-2">{agent.description}</p>
        </div>
        {renderAgentWorkspace()}
      </div>
    </Layout>
  );
};

export default AgentWorkspace;
