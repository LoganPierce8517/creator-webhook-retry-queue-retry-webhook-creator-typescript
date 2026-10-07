import { z } from "zod";
import { infrai } from "./infrai.js";

const deliveryQueue = "creator-webhook-deliveries";

export const deliveryRequest = z.object({
  assetId: z.string().min(1),
  subscriberUrl: z.string().url(),
  content: z.string().min(1)
});
export type DeliveryRequest = z.infer<typeof deliveryRequest>;

export function shouldRetry(status: number): boolean {
  return status === 429 || status >= 500;
}

export async function enqueueDelivery(input: unknown) {
  const request = deliveryRequest.parse(input);
  const deliveryId = `${request.assetId}:${request.subscriberUrl}`;
  const payload = JSON.stringify({ deliveryId, subscriberUrl: request.subscriberUrl, assetId: request.assetId, content: request.content, attempt: 0 });
  return infrai.queue.publish({ queue: deliveryQueue, payload });
}

export async function processOne(delivery: DeliveryRequest, send: (url: string, body: string) => Promise<number>) {
  const body = JSON.stringify({ asset_id: delivery.assetId, content: delivery.content });
  const status = await send(delivery.subscriberUrl, body);
  return { status, retry: shouldRetry(status) };
}
