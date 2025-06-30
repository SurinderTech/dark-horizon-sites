
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
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
          Import multiple leads from a CSV file. Your CSV should have columns for "name" and "email".
        </div>
        
        <Button
          variant="outline"
          onClick={downloadTemplate}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Download CSV Template
        </Button>

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

        <Button
          onClick={importLeads}
          disabled={!file || importing}
          className="w-full"
        >
          {importing ? 'Importing...' : 'Import Leads'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkLeadImport;
