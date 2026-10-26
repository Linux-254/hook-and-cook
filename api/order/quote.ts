import type { IncomingMessage, ServerResponse } from "http";
import { computeOrderQuote } from "../../src/lib/pricing";

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
    const items = Array.isArray(payload.items) ? payload.items : [];
    const diningMode = payload.diningMode || "dine_in";

    const quote = computeOrderQuote(items, diningMode);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(quote));
  } catch (err: unknown) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid request payload", details: (err as Error).message }));
  }
}
