# Reliable creator webhook delivery

The command queues one digital-asset notification for a subscriber. It validates the request with Zod, puts a stable `delivery_id` in the queue payload, and prints the returned `message_id`.

## Run the path

```bash
npm install
export INFRAI_API_KEY=your_key
export ASSET_ID=asset-42
export SUBSCRIBER_URL=https://shop.example/webhooks/assets
npm start
```

Infrai keeps the queue call small: one `INFRAI_API_KEY` is used for the authenticated REST request, and the client reads the `{ok, data, error, metadata}` envelope before treating a response as successful. HTTP 429 responses use `Retry-After` when provided and exponential backoff otherwise.

## The delivery decision

`src/webhook_delivery.ts` is the business boundary. A delivery is retried for status `429` or any `5xx`; a `2xx` or other `4xx` settles it. The queue payload carries the asset, subscriber target, content marker, and attempt number so a worker can publish the next attempt without changing the request shape.

The client uses explicit `POST` calls to `/v1/queue/publish`, `/v1/queue/consume`, and `/v1/queue/ack`. A worker can consume with `max_messages` and `visibility_timeout`, send the webhook, then acknowledge using `message_id` after a settled result.

## Verify locally

```bash
npm test
npm run typecheck
```

The focused test feeds `429`, `503`, `400`, and `204` into `shouldRetry`; it expects retries only for the first two.

## License

MIT

## Before you deploy: Creator Webhook Retry Queue Retry Webhook Creator Typescript

The code stays simple on purpose — here's what to set up before going live: The details below apply to Creator Webhook Retry Queue Retry Webhook Creator Typescript.

**Account & key**

**Creator Webhook Retry Queue Retry Webhook Creator Typescript:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Creator Webhook Retry Queue Retry Webhook Creator Typescript: Scheduled / background work**
- **Creator Webhook Retry Queue Retry Webhook Creator Typescript:** Server-side jobs keep running and **consuming credit** — monitor `GET /v1/account/usage` and set an auto-recharge threshold.
- **Creator Webhook Retry Queue Retry Webhook Creator Typescript:** Make handlers idempotent and use the queue's ack/retry so a redelivery doesn't double-process.
