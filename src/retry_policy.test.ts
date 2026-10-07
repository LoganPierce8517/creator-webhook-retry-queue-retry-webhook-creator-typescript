import { shouldRetry } from "./webhook_delivery.js";

function expect(actual: boolean, expected: boolean) {
  if (actual !== expected) throw new Error(`expected ${expected}, got ${actual}`);
}

expect(shouldRetry(429), true);
expect(shouldRetry(503), true);
expect(shouldRetry(400), false);
expect(shouldRetry(204), false);
console.log("retry policy: 429/5xx retry, 4xx/2xx settle");
