
/**
 * Supabase Edge Function: scheduled-twitter-poster
 * This function is intended to be run via cron every minute.
 * It fetches scheduled Twitter posts from the scheduled_posts table,
 * posts them to X (Twitter) using stored API keys,
 * and updates their status and response/error.
 */
import { createHmac } from "node:crypto";

// Get API keys and tokens from environment variables
const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")?.trim();

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function validateEnvVars() {
  if (!API_KEY) throw new Error("Missing TWITTER_CONSUMER_KEY");
  if (!API_SECRET) throw new Error("Missing TWITTER_CONSUMER_SECRET");
  if (!ACCESS_TOKEN) throw new Error("Missing TWITTER_ACCESS_TOKEN");
  if (!ACCESS_TOKEN_SECRET) throw new Error("Missing TWITTER_ACCESS_TOKEN_SECRET");
  if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

// Generate OAuth signature (as per Twitter API 2.0 instructions)
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString =
    `${method}&${encodeURIComponent(url)}&${encodeURIComponent(
      Object.entries(params)
        .sort()
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&")
    )}`;
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  const hmacSha1 = createHmac("sha1", signingKey);
  const signature = hmacSha1.update(signatureBaseString).digest("base64");
  return signature;
}

function generateOAuthHeader(method: string, url: string) {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: API_KEY!,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN!,
    oauth_version: "1.0",
  };
  const signature = generateOAuthSignature(method, url, oauthParams, API_SECRET!, ACCESS_TOKEN_SECRET!);
  const fullParams = { ...oauthParams, oauth_signature: signature };
  const header =
    "OAuth " +
    Object.entries(fullParams)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ");
  return header;
}

const BASE_URL = "https://api.x.com/2";

// --- Function to fetch pending posts due for sending ---
async function fetchPendingPosts() {
  const url = `${SUPABASE_URL}/rest/v1/scheduled_posts?platform=eq.twitter&status=eq.pending&scheduled_at=lte.${new Date().toISOString()}&order=scheduled_at.asc`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY!}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch scheduled posts: ${res.status}`);
  return await res.json();
}

// --- Function to update a post's status/response/error ---
async function markPostSent(id: number, response: any) {
  const url = `${SUPABASE_URL}/rest/v1/scheduled_posts?id=eq.${id}`;
  await fetch(url, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY!}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      status: "sent",
      response,
      updated_at: new Date().toISOString(),
    }),
  });
}
async function markPostFailed(id: number, errorMsg: string) {
  const url = `${SUPABASE_URL}/rest/v1/scheduled_posts?id=eq.${id}`;
  await fetch(url, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY!}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      status: "failed",
      error_message: errorMsg,
      updated_at: new Date().toISOString(),
    }),
  });
}

// --- Main Twitter Posting Logic ---
async function sendTweet(text: string) {
  const url = `${BASE_URL}/tweets`;
  const method = "POST";
  const oauthHeader = generateOAuthHeader(method, url);

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: oauthHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
  }
  return JSON.parse(responseText);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    validateEnvVars();

    const pendingPosts = await fetchPendingPosts();
    if (!Array.isArray(pendingPosts) || !pendingPosts.length) {
      return new Response(JSON.stringify({ success: true, processed: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let processed = 0, sent = 0, failed = 0;

    for (const post of pendingPosts) {
      try {
        const result = await sendTweet(post.content);
        await markPostSent(post.id, result);
        sent++;
      } catch (err: any) {
        await markPostFailed(post.id, String(err.message || err));
        failed++;
      }
      processed++;
    }

    return new Response(JSON.stringify({ success: true, processed, sent, failed }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
