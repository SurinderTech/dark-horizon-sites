import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, AlertCircle, CheckCircle, FileSpreadsheet, Link } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BulkLeadImportProps {
  onImportComplete: () => void;
}

const BulkLeadImport = ({ onImportComplete }: BulkLeadImportProps) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [importStats, setImportStats] = useState<{
    total: number;
    success: number;
    failed: number;
  } | null>(null);

  const downloadTemplate = () => {
    const csvContent = "name,email\nJohn Doe,john@example.com\nJane Smith,jane@example.com\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToGoogleSheets = async () => {
    if (!user) return;

    setImporting(true);
    try {
      // Fetch current leads to export
      const { data: leads, error } = await supabase
        .from('email_leads')
        .select('name, email, send_status, created_at')
        .eq('user_id', user.id);

      if (error) throw error;

      const sheetData = leads?.map(lead => [
        lead.name || '',
        lead.email,
        lead.send_status,
        new Date(lead.created_at).toLocaleDateString()
      ]) || [];

      const { data, error: functionError } = await supabase.functions.invoke('google-sheets-integration', {
        body: {
          action: 'create',
          sheetName: `Email Leads - ${new Date().toLocaleDateString()}`,
          data: sheetData
        }
      });

      if (functionError) throw functionError;

      if (data?.success) {
        toast.success('Google Sheet created successfully!');
        // Open the sheet in a new tab
        window.open(data.spreadsheetUrl, '_blank');
      } else {
        throw new Error(data?.error || 'Failed to create Google Sheet');
      }

    } catch (error: any) {
      console.error('Export to Google Sheets error:', error);
      toast.error('Failed to export to Google Sheets: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  const importFromGoogleSheets = async () => {
    if (!googleSheetsUrl || !user) return;

    // Extract spreadsheet ID from URL
    const match = googleSheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      toast.error('Invalid Google Sheets URL. Please provide a valid URL.');
      return;
    }

    const spreadsheetId = match[1];
    setImporting(true);

    try {
      const { data, error } = await supabase.functions.invoke('google-sheets-integration', {
        body: {
          action: 'read',
          spreadsheetId
        }
      });

      if (error) throw error;

      if (data?.success && data.leads) {
        // Import leads in batches
        const leads = data.leads;
        let success = 0;
        let failed = 0;

        const batchSize = 100;
        for (let i = 0; i < leads.length; i += batchSize) {
          const batch = leads.slice(i, i + batchSize);
          
          const leadsToInsert = batch.map((lead: any) => ({
            user_id: user.id,
            name: lead.name,
            email: lead.email
          }));

          const { data: insertData, error: insertError } = await supabase
            .from('email_leads')
            .insert(leadsToInsert)
            .select();

          if (insertError) {
            console.error('Batch insert error:', insertError);
            failed += batch.length;
          } else {
            success += insertData?.length || 0;
          }
        }

        setImportStats({ total: leads.length, success, failed });
        
        if (success > 0) {
          toast.success(`Successfully imported ${success} leads from Google Sheets!`);
          onImportComplete();
        }
        
        if (failed > 0) {
          toast.error(`Failed to import ${failed} leads`);
        }

      } else {
        throw new Error(data?.error || 'Failed to read Google Sheets data');
      }

    } catch (error: any) {
      console.error('Import from Google Sheets error:', error);
      toast.error('Failed to import from Google Sheets: ' + error.message);
      setImportStats({ total: 0, success: 0, failed: 1 });
    } finally {
      setImporting(false);
    }
  };

  const parseCSV = (text: string): { name: string; email: string }[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const nameIndex = headers.findIndex(h => h.includes('name'));
    const emailIndex = headers.findIndex(h => h.includes('email'));
    
    if (emailIndex === -1) {
      throw new Error('Email column not found. Please ensure your CSV has an "email" column.');
    }
    
    const leads = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const email = values[emailIndex];
      
      if (email && email.includes('@')) {
        leads.push({
          name: nameIndex !== -1 ? values[nameIndex] || email : email,
          email: email
        });
      }
    }
    
    return leads;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setImportStats(null);
    }
  };

  const importLeads = async () => {
    if (!file || !user) return;

    setImporting(true);
    let success = 0;
    let failed = 0;

    try {
      const text = await file.text();
      const leads = parseCSV(text);
      
      console.log(`Parsed ${leads.length} leads from CSV`);

      // Import leads in batches of 100
      const batchSize = 100;
      for (let i = 0; i < leads.length; i += batchSize) {
        const batch = leads.slice(i, i + batchSize);
        
        const leadsToInsert = batch.map(lead => ({
          user_id: user.id,
          name: lead.name,
          email: lead.email
        }));

        const { data, error } = await supabase
          .from('email_leads')
          .insert(leadsToInsert)
          .select();

        if (error) {
          console.error('Batch insert error:', error);
          failed += batch.length;
        } else {
          success += data?.length || 0;
        }
      }

      setImportStats({ total: leads.length, success, failed });
      
      if (success > 0) {
        toast.success(`Successfully imported ${success} leads!`);
        onImportComplete();
      }
      
      if (failed > 0) {
        toast.error(`Failed to import ${failed} leads`);
      }

    } catch (error: any) {
      console.error('Import error:', error);
      toast.error('Failed to import leads: ' + error.message);
      setImportStats({ total: 0, success: 0, failed: 1 });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="mr-2 h-5 w-5" />
          Bulk Import Leads
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Import multiple leads from CSV or Google Sheets. Your data should have columns for "name" and "email".
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Download CSV Template
          </Button>
          <Button variant="outline" onClick={exportToGoogleSheets} disabled={importing}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export to Google Sheets
          </Button>
        </div>

        {/* CSV Upload Section */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Import from CSV</h4>
          <div>
            <Label htmlFor="csv-file">Select CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <strong>Selected:</strong> {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            </div>
          )}

          <Button onClick={importLeads} disabled={!file || importing} className="w-full">
            {importing ? 'Importing...' : 'Import from CSV'}
          </Button>
        </div>

        {/* Google Sheets Section */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Import from Google Sheets</h4>
          <div>
            <Label htmlFor="sheets-url">Google Sheets URL</Label>
            <Input
              id="sheets-url"
              placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit"
              value={googleSheetsUrl}
              onChange={(e) => setGoogleSheetsUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Make sure your Google Sheet is publicly accessible or shared with view permissions
            </p>
          </div>

          <Button 
            onClick={importFromGoogleSheets} 
            disabled={!googleSheetsUrl || importing} 
            className="w-full"
          >
            <Link className="mr-2 h-4 w-4" />
            {importing ? 'Importing...' : 'Import from Google Sheets'}
          </Button>
        </div>

        {/* Import Results */}
        {importStats && (
          <div className="p-3 rounded-lg border">
            <div className="flex items-center mb-2">
              {importStats.success > 0 ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span className="font-medium">Import Results</span>
            </div>
            <div className="text-sm space-y-1">
              <p>Total processed: {importStats.total}</p>
              <p className="text-green-600">Successfully imported: {importStats.success}</p>
              {importStats.failed > 0 && (
                <p className="text-red-600">Failed: {importStats.failed}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkLeadImport;
