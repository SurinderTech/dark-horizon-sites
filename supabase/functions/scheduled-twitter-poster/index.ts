
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
  const missing = [];
  if (!API_KEY) missing.push("TWITTER_CONSUMER_KEY");
  if (!API_SECRET) missing.push("TWITTER_CONSUMER_SECRET");
  if (!ACCESS_TOKEN) missing.push("TWITTER_ACCESS_TOKEN");
  if (!ACCESS_TOKEN_SECRET) missing.push("TWITTER_ACCESS_TOKEN_SECRET");
  if (!SUPABASE_URL) missing.push("SUPABASE_URL");
  if (!SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
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
const BASE_URL_MEDIA = "https://upload.twitter.com/1.1";

// --- Function to fetch pending posts due for sending ---
async function fetchPendingPosts() {
  const currentTime = new Date().toISOString();
  const url = `${SUPABASE_URL}/rest/v1/scheduled_posts?platform=eq.twitter&status=eq.pending&scheduled_at=lte.${currentTime}&order=scheduled_at.asc`;
  
  console.log("Fetching pending posts from:", url);
  console.log("Current time:", currentTime);
  
  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY!}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to fetch posts:", res.status, errorText);
    throw new Error(`Failed to fetch scheduled posts: ${res.status} - ${errorText}`);
  }
  
  const posts = await res.json();
  console.log("Found pending posts:", posts.length, posts);
  return posts;
}

// Function to upload image to Twitter (media/upload)
async function uploadImageToTwitterFromUrl(imageUrl: string): Promise<string> {
  console.log("Uploading image to Twitter:", imageUrl);
  
  // Download the image data
  const imgResp = await fetch(imageUrl);
  if (!imgResp.ok) throw new Error(`Failed to fetch image: ${await imgResp.text()}`);
  
  const blob = await imgResp.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const media_data = Buffer.from(arrayBuffer).toString("base64");

  // Twitter media/upload endpoint
  const url = `${BASE_URL_MEDIA}/media/upload.json`;
  const method = "POST";
  const oauthHeader = generateOAuthHeader(method, url);
  const formBody = new URLSearchParams();
  formBody.append("media_data", media_data);

  const resp = await fetch(url, {
    method,
    headers: {
      Authorization: oauthHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody.toString(),
  });
  
  const respText = await resp.text();
  console.log("Twitter media upload response:", resp.status, respText);
  
  if (!resp.ok) {
    throw new Error(`Twitter media upload failed: ${resp.status} - ${respText}`);
  }
  
  const body = JSON.parse(respText);
  if (!body.media_id_string) throw new Error("Twitter upload did not return media_id_string");
  return body.media_id_string;
}

// --- Function to update a post's status/response/error ---
async function markPostSent(id: number, response: any) {
  console.log(`Marking post ${id} as sent`);
  const url = `${SUPABASE_URL}/rest/v1/scheduled_posts?id=eq.${id}`;
  const res = await fetch(url, {
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
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to mark post as sent:", errorText);
  } else {
    console.log(`Successfully marked post ${id} as sent`);
  }
}

async function markPostFailed(id: number, errorMsg: string) {
  console.log(`Marking post ${id} as failed:`, errorMsg);
  const url = `${SUPABASE_URL}/rest/v1/scheduled_posts?id=eq.${id}`;
  const res = await fetch(url, {
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
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to mark post as failed:", errorText);
  }
}

// --- Main Twitter Posting Logic ---
async function sendTweet(text: string, media_ids?: string[]) {
  const url = `${BASE_URL}/tweets`;
  const method = "POST";
  const oauthHeader = generateOAuthHeader(method, url);

  console.log("Sending tweet:", text.substring(0, 50) + "...");

  const body: Record<string, any> = { text };
  if (media_ids && media_ids.length > 0) {
    body.media = { media_ids };
    console.log("Including media_ids:", media_ids);
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: oauthHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseText = await response.text();
  console.log("Twitter API response:", response.status, responseText);
  
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
    console.log("=== Scheduled Twitter poster starting ===");
    validateEnvVars();

    const pendingPosts = await fetchPendingPosts();
    if (!Array.isArray(pendingPosts) || !pendingPosts.length) {
      console.log("No pending posts found");
      return new Response(JSON.stringify({ success: true, processed: 0 }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    let processed = 0, sent = 0, failed = 0;

    for (const post of pendingPosts) {
      try {
        console.log(`Processing post ${post.id}: ${post.content?.substring(0, 50)}...`);
        console.log(`Post scheduled_at: ${post.scheduled_at}`);
        
        let media_ids: string[] | undefined = undefined;
        
        // Handle image upload if present
        if (post.image_url && typeof post.image_url === "string") {
          try {
            console.log("Post has image, uploading to Twitter:", post.image_url);
            const media_id = await uploadImageToTwitterFromUrl(post.image_url);
            media_ids = [media_id];
            console.log("Image uploaded successfully, media_id:", media_id);
          } catch (imgErr: any) {
            console.error(`Failed to upload image for post ${post.id}:`, imgErr.message);
            // Continue without image rather than failing the whole post
          }
        }
        
        const result = await sendTweet(post.content, media_ids);
        await markPostSent(post.id, result);
        console.log(`Successfully sent post ${post.id}`);
        sent++;
      } catch (err: any) {
        console.error(`Failed to send post ${post.id}:`, err.message);
        await markPostFailed(post.id, String(err.message || err));
        failed++;
      }
      processed++;
    }

    console.log(`=== Processed ${processed} posts: ${sent} sent, ${failed} failed ===`);
    return new Response(JSON.stringify({ success: true, processed, sent, failed }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  } catch (error: any) {
    console.error("Edge function error:", error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
