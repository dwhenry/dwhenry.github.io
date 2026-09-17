---
layout: post
title: "Code reference: attachToExecutionPromise"
subtitle: 'The full source behind "A background job hiding three conditionals deep"'
permalink: /2026/09/17/a-background-job-hiding-three-conditionals-deep/code-reference/
date: 2026-09-17
---

This is the complete source for everything referenced in [A background job hiding three conditionals deep]({{ '/2026/09/17/a-background-job-hiding-three-conditionals-deep/' | relative_url }}) — the `attachToExecutionPromise()` utility, its capture/flush test helpers, and the call site that first surfaced the problem. Kept here rather than inline in the post so the article stays readable and this stays easy to link to directly.

## `attachToExecutionPromise()` and its test helpers

```ts
import { type Transaction } from "objection";

import { ENV } from "env";

interface CapturedExecutionPromiseCallback {
  /** What the callback does, e.g. 'invoice-enqueue' — lets a test
   * pick out the one it cares about via getCapturedExecutionPromiseCallback()
   * when more than one code path attaches a callback in the same test. */
  description: string;
  fn: () => Promise<void>;
}

/**
 * Callbacks captured instead of being attached to a transaction, when
 * running under test. See attachToExecutionPromise() and
 * docs/executionPromise.md.
 */
let capturedCallbacks: CapturedExecutionPromiseCallback[] = [];

/** Clears whatever callbacks have been captured so far. Called automatically
 * before every test (see transactionPerTest() in transaction-wrapper.ts) —
 * call directly only if you need a clean slate mid-test. */
export const resetCapturedExecutionPromiseCallbacks = (): void => {
  capturedCallbacks = [];
};

/** Returns every callback captured so far, along with the description it was
 * attached with, in the order they were attached. Most tests are better
 * served by getCapturedExecutionPromiseCallback(), which finds one by
 * description. */
export const getCapturedExecutionPromiseCallbacks =
  (): CapturedExecutionPromiseCallback[] => capturedCallbacks;

/**
 * Returns the single callback captured under `description`. Throws if none
 * (or more than one) was captured with that description, so a test fails
 * clearly instead of silently running the wrong callback.
 */
export const getCapturedExecutionPromiseCallback = (
  description: string,
): (() => Promise<void>) => {
  const matches = capturedCallbacks.filter(
    (callback) => callback.description === description,
  );

  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one callback captured with description "${description}", found ${
        matches.length
      }. Captured descriptions: ${
        capturedCallbacks.map((callback) => callback.description).join(", ") ||
        "(none)"
      }`,
    );
  }

  return matches[0].fn;
};

/**
 * Runs every callback captured so far and clears them, so a later flush
 * doesn't re-run ones already handled. Useful in a test that triggers more
 * than one deferred write over its lifetime (e.g. two separate requests),
 * where each needs to run before moving on to the next step.
 */
export const flushCapturedExecutionPromiseCallbacks =
  async (): Promise<void> => {
    const callbacks = capturedCallbacks;
    capturedCallbacks = [];
    await Promise.all(callbacks.map((callback) => callback.fn()));
  };

/**
 * Attaches `fn` to run once `trx` settles (commits or rolls back), without
 * awaiting it — the standard way to defer work (e.g. enqueuing a job) until
 * the caller's transaction is guaranteed to have actually happened, rather
 * than running it as part of the transaction itself. `description` identifies
 * what the callback does (e.g. 'invoice-enqueue'), so a test can find
 * and run the right one via getCapturedExecutionPromiseCallback().
 *
 * Under NODE_ENV=test, `fn` is captured (see
 * getCapturedExecutionPromiseCallback()) instead of actually being
 * attached — a deferred, unawaited write is too easy to have land in a
 * completely unrelated later test once its own transaction has already
 * rolled back. See docs/executionPromise.md. Call the captured function
 * directly in your test if you need to exercise what it does.
 */
export const attachToExecutionPromise = (
  trx: Transaction,
  description: string,
  fn: () => Promise<void>,
): void => {
  if (ENV.NODE_ENV === "test") {
    capturedCallbacks.push({ description, fn });
    return;
  }

  trx.executionPromise.then(fn);
};
```

## Wired into the test suite

A simple global beforeEach and every test starts with a clean captured-callback slate:

```ts
beforeEach(async function () {
  resetCapturedExecutionPromiseCallbacks();
});
```

## The call site that surfaced the problem

`enqueueInvoiceRequest()`, buried behind a product-dispatch switch, a legacy-plan early return, a brand check, and an invoice-count guard before the deferred enqueue itself ever runs:

```ts
// server/src/services/lead-conversion/plan/index.ts
if (attributes.brandId === BRAND_ID.acme) {
  await enqueueInvoiceRequest({ plan, trx });
}

const enqueueInvoiceRequest = async ({ plan, trx }) => {
  const invoices = await getInvoicesForPlan(plan);

  if (invoices.length !== 1) {
    throw new Error(`Expected exactly one invoice, found ${invoices.length}`);
  }

  const invoice = invoices[0];
  const { inboundWebhookRequestId } = invoice;

  if (!inboundWebhookRequestId && invoice.reference !== "fake-payment") {
    throw new Error("Expected invoice to have an inboundWebhookRequestId");
  }

  if (inboundWebhookRequestId) {
    // We need to wait for the transaction to commit before we can add the
    // item to the queue
    attachToExecutionPromise(trx, "invoice-enqueue", async () => {
      await invoiceQueue.addItem({
        type: "create-invoice",
        inboundWebhookRequestId,
        planId: plan.id,
      });
    });
  }
};
```

## Running the captured callback in a test

```ts
result = await Product.transaction(async (trx) => {
  return await convertProduct({ lead, leadEvent, trx });
});

// attachToExecutionPromise() only defers for real outside of tests —
// under test it captures the callback instead of running it, so run it
// directly to exercise what it would have done (see docs/executionPromise.md).
await getCapturedExecutionPromiseCallback("invoice-enqueue")();
```

Or, where a test triggers more than one deferred write and just wants all of them to have run before it makes its assertions:

```ts
await processStripeEventCompleted();
await flushCapturedExecutionPromiseCallbacks();
```
