
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Play, Settings, BarChart3, Mail, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';

const DataAutomationAgent = ({ agent }) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState('');
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Email Campaign State
  const [emailCampaign, setEmailCampaign] = useState({
    leadsSheetUrl: '',
    templatesSheetUrl: '',
    senderName: 'Surinder kumar',
    campaignName: '',
    isRunning: false
  });
  const [campaignHistory, setCampaignHistory] = useState([]);
  const [campaignStats, setCampaignStats] = useState({
    totalSent: 0,
    successRate: 0,
    lastRun: 'Never'
  });

  const handleCreateWorkflow = async () => {
    if (!workflowName || !workflowSteps) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newWorkflow = {
        id: Date.now(),
        name: workflowName,
        steps: workflowSteps,
        status: 'Active',
        created: new Date().toLocaleDateString(),
        lastRun: 'Never',
        executions: 0
      };
      
      setWorkflows(prev => [newWorkflow, ...prev]);
      setWorkflowName('');
      setWorkflowSteps('');
      toast.success('Workflow created successfully!');
    } catch (error) {
      toast.error('Failed to create workflow');
    } finally {
      setLoading(false);
    }
  };

  const handleRunWorkflow = async (workflowId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setWorkflows(prev => prev.map(workflow => 
        workflow.id === workflowId 
          ? { 
              ...workflow, 
              lastRun: new Date().toLocaleString(),
              executions: workflow.executions + 1
            }
          : workflow
      ));
      
      toast.success('Workflow executed successfully!');
    } catch (error) {
      toast.error('Failed to run workflow');
    } finally {
      setLoading(false);
    }
  };

  const handleRunEmailCampaign = async () => {
    if (!emailCampaign.leadsSheetUrl || !emailCampaign.templatesSheetUrl || !emailCampaign.campaignName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setEmailCampaign(prev => ({ ...prev, isRunning: true }));
    setLoading(true);

    try {
      // Simulate the n8n workflow execution
      toast.info('Starting email campaign...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.info('Reading leads from Google Sheets...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.info('Filtering leads (excluding already sent)...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.info('Loading email templates...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.info('Sending emails...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.info('Updating Google Sheets with send status...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate campaign results
      const emailsSent = Math.floor(Math.random() * 50) + 10;
      const successRate = Math.floor(Math.random() * 20) + 80;

      const newCampaign = {
        id: Date.now(),
        name: emailCampaign.campaignName,
        emailsSent,
        successRate,
        timestamp: new Date().toLocaleString(),
        status: 'Completed'
      };

      setCampaignHistory(prev => [newCampaign, ...prev]);
      setCampaignStats(prev => ({
        totalSent: prev.totalSent + emailsSent,
        successRate: Math.floor((prev.successRate + successRate) / 2),
        lastRun: new Date().toLocaleString()
      }));

      toast.success(`Email campaign completed! Sent ${emailsSent} emails with ${successRate}% success rate.`);
      
      // Reset form
      setEmailCampaign(prev => ({
        ...prev,
        campaignName: '',
        isRunning: false
      }));

    } catch (error) {
      toast.error('Failed to run email campaign');
    } finally {
      setLoading(false);
      setEmailCampaign(prev => ({ ...prev, isRunning: false }));
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Workflow</TabsTrigger>
          <TabsTrigger value="email-campaign">Email Campaign</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Create Data Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  id="workflow-name"
                  placeholder="e.g., Daily Sales Report"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="workflow-steps">Workflow Steps</Label>
                <Textarea
                  id="workflow-steps"
                  placeholder="Describe the automation steps (e.g., 'Fetch data from API, Transform data, Send email report')"
                  value={workflowSteps}
                  onChange={(e) => setWorkflowSteps(e.target.value)}
                  rows={4}
                />
              </div>
              <Button 
                onClick={handleCreateWorkflow} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating Workflow...' : 'Create Workflow'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-campaign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email Campaign Automation
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Automated email campaigns using Google Sheets for leads and templates
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Q1 Marketing Campaign"
                  value={emailCampaign.campaignName}
                  onChange={(e) => setEmailCampaign(prev => ({ ...prev, campaignName: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="leads-sheet">Leads Google Sheet URL</Label>
                <Input
                  id="leads-sheet"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={emailCampaign.leadsSheetUrl}
                  onChange={(e) => setEmailCampaign(prev => ({ ...prev, leadsSheetUrl: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Sheet should contain Email, Name, and send status columns
                </p>
              </div>

              <div>
                <Label htmlFor="templates-sheet">Email Templates Google Sheet URL</Label>
                <Input
                  id="templates-sheet"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={emailCampaign.templatesSheetUrl}
                  onChange={(e) => setEmailCampaign(prev => ({ ...prev, templatesSheetUrl: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Sheet should contain subject and body columns for email templates
                </p>
              </div>

              <div>
                <Label htmlFor="sender-name">Sender Name</Label>
                <Input
                  id="sender-name"
                  value={emailCampaign.senderName}
                  onChange={(e) => setEmailCampaign(prev => ({ ...prev, senderName: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleRunEmailCampaign} 
                disabled={loading || emailCampaign.isRunning}
                className="w-full"
              >
                {emailCampaign.isRunning ? 'Running Campaign...' : 'Start Email Campaign'}
              </Button>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Workflow Process
                </h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Read leads from Google Sheets (Sheet1)</li>
                  <li>Filter leads that haven't been contacted (send status ≠ 'sent')</li>
                  <li>Load email templates from Google Sheets (Sheet2)</li>
                  <li>For each lead, select random template and personalize</li>
                  <li>Send email via Gmail with random template</li>
                  <li>Update lead status and timestamp in Google Sheets</li>
                  <li>Wait between sends to avoid rate limits</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {campaignHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Campaign History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaignHistory.map((campaign) => (
                    <div key={campaign.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <p className="text-sm text-muted-foreground">{campaign.timestamp}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{campaign.emailsSent} emails sent</p>
                        <p className="text-sm text-green-600">{campaign.successRate}% success rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          {workflows.length > 0 ? (
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold">{workflow.name}</h3>
                          <span className="ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {workflow.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{workflow.steps}</p>
                        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Created:</span>
                            <p className="font-medium">{workflow.created}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Run:</span>
                            <p className="font-medium">{workflow.lastRun}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Executions:</span>
                            <p className="font-medium">{workflow.executions}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleRunWorkflow(workflow.id)}
                          disabled={loading}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Run
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No workflows created yet. Create your first automation!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Total Workflows</p>
                    <p className="text-2xl font-bold">{workflows.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Play className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Total Executions</p>
                    <p className="text-2xl font-bold">
                      {workflows.reduce((sum, w) => sum + w.executions, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Active Workflows</p>
                    <p className="text-2xl font-bold">
                      {workflows.filter(w => w.status === 'Active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Campaign Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Mail className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Total Emails Sent</p>
                    <p className="text-2xl font-bold">{campaignStats.totalSent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">{campaignStats.successRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Campaigns Run</p>
                    <p className="text-2xl font-bold">{campaignHistory.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataAutomationAgent;
