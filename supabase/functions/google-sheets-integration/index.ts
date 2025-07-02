
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GoogleSheetsRequest {
  action: 'create' | 'read';
  sheetName?: string;
  data?: any[];
  spreadsheetId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Google Sheets function called with method:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const googleServiceAccountKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase configuration");
    }

    if (!googleServiceAccountKey) {
      throw new Error("Missing Google Service Account key");
    }

    // Parse the service account key
    const serviceAccount = JSON.parse(googleServiceAccountKey);
    
    // Get OAuth2 access token
    const getAccessToken = async () => {
      const jwtHeader = {
        alg: "RS256",
        typ: "JWT"
      };

      const now = Math.floor(Date.now() / 1000);
      const jwtPayload = {
        iss: serviceAccount.client_email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600
      };

      // Create JWT manually (simplified for edge function)
      const encoder = new TextEncoder();
      const importedKey = await crypto.subtle.importKey(
        "pkcs8",
        encoder.encode(serviceAccount.private_key.replace(/\\n/g, '\n')),
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
        },
        false,
        ["sign"]
      );

      const jwtHeaderEncoded = btoa(JSON.stringify(jwtHeader)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      const jwtPayloadEncoded = btoa(JSON.stringify(jwtPayload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      const jwtData = `${jwtHeaderEncoded}.${jwtPayloadEncoded}`;
      
      const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        importedKey,
        encoder.encode(jwtData)
      );
      
      const jwtSignatureEncoded = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      
      const jwt = `${jwtData}.${jwtSignatureEncoded}`;

      // Exchange JWT for access token
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
      });

      if (!tokenResponse.ok) {
        throw new Error(`Failed to get access token: ${await tokenResponse.text()}`);
      }

      const tokenData = await tokenResponse.json();
      return tokenData.access_token;
    };

    const accessToken = await getAccessToken();

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    });

    // Get user from JWT token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    console.log("User authentication:", { userId: user?.id, error: userError });
    
    if (userError || !user) {
      throw new Error("Unauthorized: " + (userError?.message || "No user found"));
    }

    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    
    const { action, sheetName, data, spreadsheetId }: GoogleSheetsRequest = requestBody;

    if (action === 'create') {
      // Create a new Google Sheet with lead data
      const createSheetResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            properties: {
              title: sheetName || `Email Leads - ${new Date().toLocaleDateString()}`,
            },
            sheets: [{
              properties: {
                title: 'Leads',
              },
            }],
          }),
        }
      );

      if (!createSheetResponse.ok) {
        const error = await createSheetResponse.text();
        throw new Error(`Failed to create Google Sheet: ${error}`);
      }

      const newSheet = await createSheetResponse.json();
      console.log("Created new sheet:", newSheet);

      // Add headers and data to the sheet
      const headers = [['Name', 'Email', 'Status', 'Created At']];
      const sheetData = data || [];
      const allData = [...headers, ...sheetData];

      const updateResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${newSheet.spreadsheetId}/values/Leads!A1:append?valueInputOption=RAW`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            values: allData,
          }),
        }
      );

      if (!updateResponse.ok) {
        const error = await updateResponse.text();
        throw new Error(`Failed to update Google Sheet: ${error}`);
      }

      return new Response(
        JSON.stringify({
          success: true,
          spreadsheetId: newSheet.spreadsheetId,
          spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${newSheet.spreadsheetId}/edit`,
          message: "Google Sheet created successfully!"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );

    } else if (action === 'read') {
      // Read data from existing Google Sheet
      if (!spreadsheetId) {
        throw new Error("Spreadsheet ID is required for reading data");
      }

      const readResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:Z`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!readResponse.ok) {
        const error = await readResponse.text();
        throw new Error(`Failed to read Google Sheet: ${error}`);
      }

      const sheetData = await readResponse.json();
      const rows = sheetData.values || [];
      
      if (rows.length < 2) {
        throw new Error("Sheet appears to be empty or only has headers");
      }

      // Convert rows to lead format (skip header row)
      const leads = rows.slice(1).map((row: string[]) => ({
        name: row[0] || '',
        email: row[1] || '',
      })).filter((lead: any) => lead.email && lead.email.includes('@'));

      return new Response(
        JSON.stringify({
          success: true,
          leads,
          message: `Successfully read ${leads.length} leads from Google Sheet`
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    throw new Error("Invalid action specified");

  } catch (error: any) {
    console.error("Error in Google Sheets function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: "Check the function logs for more information"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
