
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

// Helper function to convert base64url to base64
function base64urlToBase64(base64url: string): string {
  return base64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(base64url.length + (4 - base64url.length % 4) % 4, '=');
}

// Helper function to convert base64 to base64url
function base64ToBase64url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
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
    const googleApiKey = Deno.env.get("GOOGLE_SHEETS_API_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase configuration");
    }

    if (!googleServiceAccountKey) {
      throw new Error("Missing Google Service Account key");
    }

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

    // Parse the service account key
    const serviceAccount = JSON.parse(googleServiceAccountKey);
    
    // Get OAuth2 access token
    const getAccessToken = async () => {
      try {
        console.log("Starting JWT creation process...");
        const now = Math.floor(Date.now() / 1000);
        
        // Create JWT header and payload
        const header = {
          alg: "RS256",
          typ: "JWT"
        };
        
        const payload = {
          iss: serviceAccount.client_email,
          scope: "https://www.googleapis.com/auth/spreadsheets",
          aud: "https://oauth2.googleapis.com/token",
          iat: now,
          exp: now + 3600
        };

        console.log("JWT payload created for:", serviceAccount.client_email);

        // Encode header and payload
        const encodedHeader = base64ToBase64url(btoa(JSON.stringify(header)));
        const encodedPayload = base64ToBase64url(btoa(JSON.stringify(payload)));
        const signatureInput = `${encodedHeader}.${encodedPayload}`;

        console.log("JWT header and payload encoded");

        // Import the private key
        const privateKeyPem = serviceAccount.private_key;
        
        // Clean up the private key format
        let cleanPrivateKey = privateKeyPem;
        if (typeof cleanPrivateKey === 'string') {
          cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n');
        }
        
        console.log("Private key format cleaned");
        
        // Remove PEM headers and footers, and decode the key
        const privateKeyB64 = cleanPrivateKey
          .replace(/-----BEGIN PRIVATE KEY-----/g, '')
          .replace(/-----END PRIVATE KEY-----/g, '')
          .replace(/\s/g, '');
        
        console.log("Private key base64 extracted");
        
        const privateKeyBytes = Uint8Array.from(atob(privateKeyB64), c => c.charCodeAt(0));
        
        console.log("Private key bytes created, importing key...");
        
        const key = await crypto.subtle.importKey(
          "pkcs8",
          privateKeyBytes,
          {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-256",
          },
          false,
          ["sign"]
        );

        console.log("Private key imported successfully, signing JWT...");

        // Sign the JWT
        const signature = await crypto.subtle.sign(
          "RSASSA-PKCS1-v1_5",
          key,
          new TextEncoder().encode(signatureInput)
        );

        // Encode signature
        const encodedSignature = base64ToBase64url(btoa(String.fromCharCode(...new Uint8Array(signature))));
        const jwt = `${signatureInput}.${encodedSignature}`;

        console.log("JWT signed successfully, requesting access token...");

        // Exchange JWT for access token
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error("Token request failed:", errorText);
          throw new Error(`Failed to get access token: ${errorText}`);
        }

        const tokenData = await tokenResponse.json();
        console.log("Access token obtained successfully");
        return tokenData.access_token;
      } catch (jwtError) {
        console.error("JWT creation failed:", jwtError);
        throw new Error(`JWT authentication failed: ${jwtError.message}`);
      }
    };

    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    
    const { action, sheetName, data, spreadsheetId }: GoogleSheetsRequest = requestBody;

    let accessToken;
    try {
      accessToken = await getAccessToken();
    } catch (authError) {
      console.error("Authentication failed:", authError);
      // For read operations, we can fallback to API key
      if (action === 'read' && googleApiKey) {
        console.log("Will fallback to API key for read operation");
        accessToken = null;
      } else {
        throw authError;
      }
    }

    if (action === 'create') {
      console.log("Creating new Google Sheet...");
      
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
        console.error("Sheet creation failed:", error);
        throw new Error(`Failed to create Google Sheet: ${error}`);
      }

      const newSheet = await createSheetResponse.json();
      console.log("Created new sheet:", newSheet.spreadsheetId);

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
        console.error("Sheet update failed:", error);
        throw new Error(`Failed to update Google Sheet: ${error}`);
      }

      console.log("Google Sheet created and populated successfully");

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

      console.log("Reading from Google Sheet:", spreadsheetId);

      // Try with access token first, fallback to API key if it fails
      let readResponse;
      try {
        readResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:Z`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
      } catch (authError) {
        console.log("Access token failed, trying API key approach...");
        if (googleApiKey) {
          readResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:Z?key=${googleApiKey}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        } else {
          throw authError;
        }
      }

      if (!readResponse.ok) {
        const error = await readResponse.text();
        console.error("Sheet read failed:", error);
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

      console.log(`Successfully read ${leads.length} leads from Google Sheet`);

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
