
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkEmailRequest {
  campaignId: string;
  templateId: string;
  leadIds: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get user from JWT token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { campaignId, templateId, leadIds }: BulkEmailRequest = await req.json();
    
    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabaseClient
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      throw new Error("Campaign not found");
    }

    // Get email template
    const { data: template, error: templateError } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .eq('user_id', user.id)
      .single();

    if (templateError || !template) {
      throw new Error("Template not found");
    }

    // Get leads to send emails to
    const { data: leads, error: leadsError } = await supabaseClient
      .from('email_leads')
      .select('*')
      .in('id', leadIds)
      .eq('user_id', user.id)
      .eq('send_status', 'pending');

    if (leadsError || !leads) {
      throw new Error("No leads found");
    }

    console.log(`Starting bulk email campaign for ${leads.length} leads`);

    let emailsSent = 0;
    let emailsFailed = 0;

    // Create campaign history record
    const { data: historyRecord, error: historyError } = await supabaseClient
      .from('campaign_history')
      .insert({
        user_id: user.id,
        campaign_id: campaignId,
        emails_sent: 0,
        success_rate: 0,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (historyError) {
      console.error("Error creating history record:", historyError);
    }

    // Send emails in batches (similar to your n8n workflow)
    for (const lead of leads) {
      try {
        // Personalize email content
        const personalizedSubject = template.subject.replace(/{{name}}/g, lead.name || lead.email);
        const personalizedBody = template.body
          .replace(/{{name}}/g, lead.name || lead.email)
          .replace(/{{email}}/g, lead.email);

        // Send email using Resend
        const emailResponse = await resend.emails.send({
          from: `${campaign.sender_name} <onboarding@resend.dev>`,
          to: [lead.email],
          subject: personalizedSubject,
          html: personalizedBody,
        });

        console.log(`Email sent to ${lead.email}:`, emailResponse);

        // Update lead status
        await supabaseClient
          .from('email_leads')
          .update({
            send_status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', lead.id);

        emailsSent++;

        // Add delay between emails (similar to n8n workflow)
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (emailError) {
        console.error(`Failed to send email to ${lead.email}:`, emailError);
        
        // Update lead status to failed
        await supabaseClient
          .from('email_leads')
          .update({
            send_status: 'failed',
            sent_at: new Date().toISOString()
          })
          .eq('id', lead.id);

        emailsFailed++;
      }
    }

    // Update campaign history
    const successRate = leads.length > 0 ? (emailsSent / leads.length) * 100 : 0;
    
    if (historyRecord) {
      await supabaseClient
        .from('campaign_history')
        .update({
          emails_sent: emailsSent,
          success_rate: successRate,
          completed_at: new Date().toISOString()
        })
        .eq('id', historyRecord.id);
    }

    // Update campaign status
    await supabaseClient
      .from('email_campaigns')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    console.log(`Campaign completed: ${emailsSent} sent, ${emailsFailed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        emailsSent,
        emailsFailed,
        successRate: Math.round(successRate)
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in bulk email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
