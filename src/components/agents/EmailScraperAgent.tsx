
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Download, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const EmailScraperAgent = ({ agent }) => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleScrapeEmails = async () => {
    if (!sourceUrl) {
      toast.error('Please enter a source URL');
      return;
    }

    setLoading(true);
    try {
      // Simulate email scraping
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockEmails = [
        { id: 1, email: 'john.doe@company.com', source: sourceUrl, domain: 'company.com', valid: true },
        { id: 2, email: 'jane.smith@business.org', source: sourceUrl, domain: 'business.org', valid: true },
        { id: 3, email: 'contact@example.com', source: sourceUrl, domain: 'example.com', valid: true },
        { id: 4, email: 'info@website.net', source: sourceUrl, domain: 'website.net', valid: true },
        { id: 5, email: 'support@platform.io', source: sourceUrl, domain: 'platform.io', valid: true }
      ];
      
      setEmails(prev => [...prev, ...mockEmails]);
      toast.success(`Found ${mockEmails.length} valid email addresses!`);
    } catch (error) {
      toast.error('Failed to scrape emails');
    } finally {
      setLoading(false);
    }
  };

  const handleExportEmails = () => {
    if (emails.length === 0) {
      toast.error('No emails to export');
      return;
    }

    const csvContent = 'Email,Source,Domain,Valid\n' + 
      emails.map(email => `${email.email},${email.source},${email.domain},${email.valid}`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scraped_emails.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Emails exported successfully!');
  };

  const handleRemoveDuplicates = () => {
    const uniqueEmails = emails.filter((email, index, self) => 
      index === self.findIndex(e => e.email === email.email)
    );
    setEmails(uniqueEmails);
    toast.success('Duplicate emails removed!');
  };

  const filteredEmails = emails.filter(email => 
    email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="scrape" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scrape">Scrape Emails</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="scrape" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email Scraper
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="source-url">Source URL or Website</Label>
                <Input
                  id="source-url"
                  placeholder="https://example.com or paste text content"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleScrapeEmails} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Scraping Emails...' : 'Start Scraping'}
              </Button>
              <div className="text-sm text-muted-foreground">
                <p>Supported sources:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Websites and web pages</li>
                  <li>Social media profiles</li>
                  <li>Directory listings</li>
                  <li>Text content</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Scraped Emails ({emails.length})</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleRemoveDuplicates}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Duplicates
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredEmails.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredEmails.map((email) => (
                    <div key={email.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{email.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Domain: {email.domain} • Source: {email.source.substring(0, 50)}...
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 text-sm">✓ Valid</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No emails found. Start scraping to see results.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleExportEmails} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
                <Button onClick={handleExportEmails} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export as Excel
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Export includes:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Email addresses</li>
                  <li>Source URLs</li>
                  <li>Domain information</li>
                  <li>Validation status</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailScraperAgent;
