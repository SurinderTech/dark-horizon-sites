import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Plus, Send, AlertCircle, Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import BulkLeadImport from './BulkLeadImport';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  sender_name: string;
  status: string;
  created_at: string;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  send_status: string;
}

const CampaignManager = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    subject: '',
    sender_name: 'Campaign Manager'
  });
  
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    body: ''
  });

  const [leadForm, setLeadForm] = useState({
    name: '',
    email: ''
  });

  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      console.log('Fetching campaign data...');
      
      // Fetch campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('email_campaigns')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (campaignsError) {
        console.error('Campaigns error:', campaignsError);
        throw campaignsError;
      }

      // Fetch templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('email_templates')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (templatesError) {
        console.error('Templates error:', templatesError);
        throw templatesError;
      }

      // Fetch leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('email_leads')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (leadsError) {
        console.error('Leads error:', leadsError);
        throw leadsError;
      }

      setCampaigns(campaignsData || []);
      setTemplates(templatesData || []);
      setLeads(leadsData || []);
      
      console.log('Data fetched successfully:', {
        campaigns: campaignsData?.length,
        templates: templatesData?.length,
        leads: leadsData?.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data: ' + error.message);
    }
  };

  const sendBulkEmails = async () => {
    if (!selectedCampaign || !selectedTemplate) {
      toast.error('Please select both campaign and template');
      return;
    }

    const pendingLeads = leads.filter(lead => lead.send_status === 'pending');
    if (pendingLeads.length === 0) {
      toast.error('No pending leads to send emails to');
      return;
    }

    try {
      setLoading(true);
      console.log('Starting bulk email send...', {
        campaignId: selectedCampaign,
        templateId: selectedTemplate,
        leadCount: pendingLeads.length
      });
      
      toast.info(`Starting to send emails to ${pendingLeads.length} leads...`);

      const { data, error } = await supabase.functions.invoke('send-bulk-emails', {
        body: {
          campaignId: selectedCampaign,
          templateId: selectedTemplate,
          leadIds: pendingLeads.map(lead => lead.id)
        }
      });

      console.log('Bulk email response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }

      if (data?.success) {
        toast.success(data.message || `Campaign completed! Sent ${data.emailsSent} emails with ${data.successRate}% success rate`);
        fetchData(); // Refresh data
      } else {
        throw new Error(data?.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      toast.error('Failed to send bulk emails: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    if (!campaignForm.name || !campaignForm.subject) {
      toast.error('Please fill in all campaign fields');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_campaigns')
        .insert({
          user_id: user?.id,
          name: campaignForm.name,
          subject: campaignForm.subject,
          sender_name: campaignForm.sender_name
        })
        .select()
        .single();

      if (error) throw error;

      setCampaigns([data, ...campaigns]);
      setCampaignForm({ name: '', subject: '', sender_name: 'Campaign Manager' });
      toast.success('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.body) {
      toast.error('Please fill in all template fields');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_templates')
        .insert({
          user_id: user?.id,
          name: templateForm.name,
          subject: templateForm.subject,
          body: templateForm.body
        })
        .select()
        .single();

      if (error) throw error;

      setTemplates([data, ...templates]);
      setTemplateForm({ name: '', subject: '', body: '' });
      toast.success('Template created successfully!');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addLead = async () => {
    if (!leadForm.email) {
      toast.error('Email is required');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_leads')
        .insert({
          user_id: user?.id,
          name: leadForm.name,
          email: leadForm.email
        })
        .select()
        .single();

      if (error) throw error;

      setLeads([data, ...leads]);
      setLeadForm({ name: '', email: '' });
      toast.success('Lead added successfully!');
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Authentication Required</p>
          <p className="text-muted-foreground">Please log in to access the email campaign manager.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campaign Overview</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{campaigns.length}</p>
              <p className="text-sm text-muted-foreground">Campaigns</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{templates.length}</p>
              <p className="text-sm text-muted-foreground">Templates</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{leads.length}</p>
              <p className="text-sm text-muted-foreground">Total Leads</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {leads.filter(lead => lead.send_status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Create Email Campaign
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                placeholder="e.g., Product Launch 2024"
                value={campaignForm.name}
                onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="sender-name">Sender Name</Label>
              <Input
                id="sender-name"
                placeholder="Your Name"
                value={campaignForm.sender_name}
                onChange={(e) => setCampaignForm({...campaignForm, sender_name: e.target.value})}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="campaign-subject">Email Subject</Label>
            <Input
              id="campaign-subject"
              placeholder="Subject line for your campaign"
              value={campaignForm.subject}
              onChange={(e) => setCampaignForm({...campaignForm, subject: e.target.value})}
            />
          </div>
          <Button onClick={createCampaign} disabled={loading} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </CardContent>
      </Card>

      {/* Template Creation */}
      <Card>
        <CardHeader>
          <CardTitle>Create Email Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              placeholder="e.g., Welcome Email"
              value={templateForm.name}
              onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="template-subject">Subject</Label>
            <Input
              id="template-subject"
              placeholder="Email subject (use {{name}} for personalization)"
              value={templateForm.subject}
              onChange={(e) => setTemplateForm({...templateForm, subject: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="template-body">Email Body</Label>
            <Textarea
              id="template-body"
              placeholder="Email content (use {{name}} and {{email}} for personalization)"
              value={templateForm.body}
              onChange={(e) => setTemplateForm({...templateForm, body: e.target.value})}
              rows={6}
            />
          </div>
          <Button onClick={createTemplate} disabled={loading} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </CardContent>
      </Card>

      {/* Bulk Lead Import */}
      <BulkLeadImport onImportComplete={fetchData} />

      {/* Individual Lead Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Add Single Lead
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lead-name">Name</Label>
              <Input
                id="lead-name"
                placeholder="Contact name"
                value={leadForm.name}
                onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="contact@example.com"
                value={leadForm.email}
                onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
              />
            </div>
          </div>
          <Button onClick={addLead} disabled={loading} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </CardContent>
      </Card>

      {/* Send Campaign */}
      <Card>
        <CardHeader>
          <CardTitle>Send Bulk Email Campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="select-campaign">Select Campaign</Label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="select-template">Select Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Pending leads: {leads.filter(lead => lead.send_status === 'pending').length}
          </div>
          <Button onClick={sendBulkEmails} disabled={loading} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            {loading ? 'Sending...' : 'Send Bulk Emails'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignManager;
