
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSpreadsheet, Play, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

const GoogleSheetsAgent = ({ agent }) => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [automationRules, setAutomationRules] = useState('');

  const handleConnectSheet = async () => {
    if (!sheetUrl) {
      toast.error('Please enter a Google Sheets URL');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to Google Sheets
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data for demonstration
      const mockData = [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' }
      ];
      
      setSheetData(mockData);
      toast.success('Successfully connected to Google Sheets!');
    } catch (error) {
      toast.error('Failed to connect to Google Sheets');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoPost = async () => {
    if (sheetData.length === 0) {
      toast.error('Please connect to a sheet first');
      return;
    }

    setLoading(true);
    try {
      // Simulate auto-posting data
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Data successfully posted to external platforms!');
    } catch (error) {
      toast.error('Failed to auto-post data');
    } finally {
      setLoading(false);
    }
  };

  const handleSetAutomation = async () => {
    if (!automationRules) {
      toast.error('Please enter automation rules');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Automation rules saved successfully!');
    } catch (error) {
      toast.error('Failed to save automation rules');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="connect" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connect">Connect Sheet</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="data">Data View</TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="mr-2 h-5 w-5" />
                Connect Google Sheets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sheet-url">Google Sheets URL</Label>
                <Input
                  id="sheet-url"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleConnectSheet} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Play className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Connect Sheet
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="automation-rules">Define Automation Rules</Label>
                <Textarea
                  id="automation-rules"
                  placeholder="Enter automation rules (e.g., 'Post new rows to webhook URL', 'Send email when status changes')"
                  value={automationRules}
                  onChange={(e) => setAutomationRules(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSetAutomation} disabled={loading}>
                  Save Rules
                </Button>
                <Button onClick={handleAutoPost} disabled={loading} variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Auto-Post Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sheet Data</CardTitle>
            </CardHeader>
            <CardContent>
              {sheetData.length > 0 ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border p-2 text-left">ID</th>
                          <th className="border border-border p-2 text-left">Name</th>
                          <th className="border border-border p-2 text-left">Email</th>
                          <th className="border border-border p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sheetData.map((row) => (
                          <tr key={row.id}>
                            <td className="border border-border p-2">{row.id}</td>
                            <td className="border border-border p-2">{row.name}</td>
                            <td className="border border-border p-2">{row.email}</td>
                            <td className="border border-border p-2">{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No data available. Please connect to a Google Sheet first.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoogleSheetsAgent;
