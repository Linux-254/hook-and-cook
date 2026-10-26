import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  let bodyStr = "";
  for await (const chunk of req) {
    bodyStr += chunk;
  }

  try {
    const payload = JSON.parse(bodyStr || "{}");
    const { CheckoutRequestID } = payload;

    if (!CheckoutRequestID) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "CheckoutRequestID is required" }));
      return;
    }

    // Demo Mode handling
    if (CheckoutRequestID.startsWith("DEMO-")) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          ResponseCode: "0",
          ResponseDescription: "The service request has been accepted successfully (Demo).",
          MerchantRequestID: "DEMO-MR",
          CheckoutRequestID,
          ResultCode: "0",
          ResultDesc: "The service request is processed successfully.",
          isDemo: true,
        })
      );
      return;
    }

    const env = process.env.MPESA_ENV || "sandbox";
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const passkey = process.env.MPESA_PASSKEY;
    const shortcode = process.env.MPESA_SHORTCODE || "174379";

    if (!consumerKey || !consumerSecret || !passkey) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          ResultCode: "0",
          ResultDesc: "Demo mode simulated status.",
          isDemo: true,
        })
      );
      return;
    }

    const baseUrl =
      env === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

    // 1. Get OAuth Access Token
    const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${authHeader}` },
      signal: AbortSignal.timeout(8000),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Generate Timestamp & Password
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    const queryRes = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID,
      }),
      signal: AbortSignal.timeout(8000),
    });

    const queryData = await queryRes.json();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(queryData));
  } catch (err: unknown) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        ResultCode: "1",
        ResultDesc: "Query fallback: " + (err as Error).message,
      })
    );
  }
}
