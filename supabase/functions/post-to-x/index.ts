
// Edge Function: post-to-x
import { createHmac } from "node:crypto";

// Get Twitter environment variables
const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")?.trim();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function validateEnvVars() {
  if (!API_KEY) throw new Error("Missing TWITTER_CONSUMER_KEY");
  if (!API_SECRET) throw new Error("Missing TWITTER_CONSUMER_SECRET");
  if (!ACCESS_TOKEN) throw new Error("Missing TWITTER_ACCESS_TOKEN");
  if (!ACCESS_TOKEN_SECRET) throw new Error("Missing TWITTER_ACCESS_TOKEN_SECRET");
}

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

function generateOAuthHeader(method: string, url: string, extraParams: Record<string, string> = {}) {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: API_KEY!,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN!,
    oauth_version: "1.0",
    ...extraParams,
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

const BASE_URL_V2 = "https://api.x.com/2";
const BASE_URL_MEDIA = "https://upload.twitter.com/1.1";

// Function to post a tweet, supporting media_ids
async function sendTweet(text: string, media_ids?: string[]) {
  const url = `${BASE_URL_V2}/tweets`;
  const method = "POST";
  const oauthHeader = generateOAuthHeader(method, url);

  const body: Record<string, any> = { text };
  if (media_ids && media_ids.length > 0) {
    body.media = { media_ids };
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
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
  }
  return JSON.parse(responseText);
}

// Function to upload image to Twitter (media/upload)
// Accepts a public URL, downloads and uploads to X, returns media_id string
async function uploadImageToTwitterFromUrl(imageUrl: string): Promise<string> {
  // Download the image data (as a buffer)
  const imgResp = await fetch(imageUrl);
  if (!imgResp.ok) throw new Error(`Failed to fetch image: ${await imgResp.text()}`);
  const blob = await imgResp.blob();
  // Twitter requires image as a base64 string (for legacy v1.1 upload endpoint)
  const arrayBuffer = await blob.arrayBuffer();
  const media_data = Buffer.from(arrayBuffer).toString("base64");

  // Twitter media/upload endpoint
  const url = `${BASE_URL_MEDIA}/media/upload.json`;
  const method = "POST";
  // Only OAuth header, and x-www-form-urlencoded body
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
  if (!resp.ok) {
    throw new Error(`Twitter media upload failed: ${resp.status} - ${respText}`);
  }
  const body = JSON.parse(respText);
  if (!body.media_id_string) throw new Error("Twitter upload did not return media_id_string");
  return body.media_id_string;
}

// Main handler
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    validateEnvVars();
    const { text, mediaUrl } = await req.json();
    if (!text || typeof text !== "string") throw new Error("Missing or invalid tweet text.");

    let media_ids: string[] | undefined = undefined;
    if (mediaUrl && typeof mediaUrl === "string") {
      // Attempt to download and upload image to Twitter
      try {
        const media_id = await uploadImageToTwitterFromUrl(mediaUrl);
        media_ids = [media_id];
      } catch (err) {
        // Non-blocking: allow plain text post if image upload fails, but log/return error in response.
        return new Response(JSON.stringify({ success: false, error: "Failed to upload image to Twitter: " + err }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const tweetResult = await sendTweet(text, media_ids);
    return new Response(JSON.stringify({ success: true, tweet: tweetResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
