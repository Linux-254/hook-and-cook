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
    const { phoneNumber, amount, orderId } = payload;

    if (!phoneNumber || !amount) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Phone number and amount are required" }));
      return;
    }

    const env = process.env.MPESA_ENV || "sandbox";
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const passkey = process.env.MPESA_PASSKEY;
    const shortcode = process.env.MPESA_SHORTCODE || "174379";
    const callbackUrl = process.env.MPESA_CALLBACK_URL || "https://hook-and-cook.vercel.app/api/mpesa/callback";

    // If keys are not present, provide clean demo fallback so pitch works seamlessly
    if (!consumerKey || !consumerSecret || !passkey) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          isDemo: true,
          CheckoutRequestID: "DEMO-" + Date.now(),
          MerchantRequestID: "DEMO-MR-" + Date.now(),
          ResponseCode: "0",
          ResponseDescription: "Success. Request accepted for processing in sandbox demo mode.",
          CustomerMessage: "Sandbox demo: no real money moves.",
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

    if (!tokenRes.ok) {
      throw new Error("Failed to authenticate with Daraja OAuth");
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Generate Timestamp & Password
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // 3. Process STK Push Request
    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(Number(amount)),
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: orderId || "HookCook",
      TransactionDesc: "Hook and Cook Nairobi Order",
    };

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
      signal: AbortSignal.timeout(8000),
    });

    const stkData = await stkRes.json();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(stkData));
  } catch (err: unknown) {
    // If Daraja fails or times out, return honest demo fallback so pitch never dead-ends
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        isDemo: true,
        CheckoutRequestID: "DEMO-" + Date.now(),
        CustomerMessage: "Sandbox demo fallback: " + (err as Error).message,
      })
    );
  }
}
