
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Play, Settings, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

const DataAutomationAgent = ({ agent }) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState('');
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Workflow</TabsTrigger>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataAutomationAgent;
