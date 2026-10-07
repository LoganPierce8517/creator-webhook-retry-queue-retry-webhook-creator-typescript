import { enqueueDelivery } from "./webhook_delivery.js";

const input = {
  assetId: process.env.ASSET_ID ?? "asset-demo-1",
  subscriberUrl: process.env.SUBSCRIBER_URL ?? "https://example.com/webhooks/delivery",
  content: process.env.CONTENT ?? "download-ready"
};

const result = await enqueueDelivery(input);
console.log(JSON.stringify({ queued: true, message_id: result.message_id }));
