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
    // Idempotent callback processing
    const stkCallback = payload?.Body?.stkCallback;
    if (stkCallback) {
      // In production serverless functions, emit structured log without sensitive customer secrets
      console.log(`[M-Pesa Callback] CheckoutRequestID: ${stkCallback.CheckoutRequestID}, ResultCode: ${stkCallback.ResultCode}`);
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ResultCode: 0, ResultDesc: "Callback accepted" }));
  } catch {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }));
  }
}
