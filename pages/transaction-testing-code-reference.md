---
layout: post
title: "Code reference: transaction-based test isolation"
subtitle: 'The full source behind "A broken test suite, a tree and finding a rabbit"'
permalink: /2026/09/15/a-broken-test-suite-a-tree-and-finding-a-rabbit/code-reference/
date: 2026-09-15
---

This is the complete source for everything referenced in [A broken test suite, a tree and finding a rabbit]({{ '/2026/09/15/a-broken-test-suite-a-tree-and-finding-a-rabbit/' | relative_url }}) — the transaction wrapper, the savepoint helper, the monotonic timestamp helper, and the ESLint rule that enforces the `before()` fix. Kept here rather than inline in the post so the article stays readable and this stays easy to link to directly.

## `transactionPerTest()`, `transactionPerDescribe()`, `skipTransactionWrapping()`

```ts
/* eslint-disable mocha/no-top-level-hooks, mocha/no-exports, mocha/no-sibling-hooks */
import {
  transaction,
  type Transaction,
  type TransactionOrKnex,
} from 'objection'

import database from 'shared/config/database'
import { BaseModel } from 'shared/models/base-model'
import { resetCapturedExecutionPromiseCallbacks } from 'shared/utils/attach-to-execution-promise'
import { clearDatabase } from './helpers'

let skipDepth = 0

function isSkipped(): boolean {
  return skipDepth > 0
}

/**
 * Opts a block of tests out of automatic transaction wrapping. Call as the
 * first statement inside a describe() — alongside a short reason, so it's
 * clear later whether the block still needs it and can be found & removed.
 * Only that describe (and anything nested inside it) is affected; sibling
 * describes keep the default wrapping.
 *
 * Needed for blocks that:
 * - test using real commit/rollback
 *   behaviour themselves or that rely on an empty database state to run.
 */
export function skipTransactionWrapping(reason: string): void {
  before(function () {
    if (BaseModel.knex() !== database) throw new Error('do not nest skipTransactionWrapping inside a transactionPerDescribe`)
    skipDepth++
    console.log(`[transaction-wrapper] skipping — ${reason}`)
  })

  after(async function () {
    skipDepth--
    await clearDatabase()
  })
}

/**
 * Wraps every test in a transaction (or a nested savepoint, if a
 * transactionPerDescribe() is already active for this describe) that's
 * rolled back afterwards, so writes made inside a test never leak into
 * another test.
 */
export function transactionPerTest(): void {
  let previousKnex: TransactionOrKnex
  let trx: Transaction

  beforeEach(async function () {
    resetCapturedExecutionPromiseCallbacks()
    if (isSkipped()) return
    previousKnex = BaseModel.knex()
    trx = await transaction.start(BaseModel)
    BaseModel.knex(trx)
  })

  afterEach(async function () {
    if (isSkipped()) return
    // rollback() can itself throw (e.g. the transaction was already aborted
    // by a query error during the test) — knex() must still be restored, or
    // every model stays bound to a dead transaction for the rest of the run.
    try {
      await trx.rollback()
    } finally {
      BaseModel.knex(previousKnex ?? database)
    }
  })
}

/**
 * Call inside a describe's own before()/after() to wrap all of its nested
 * tests — including a shared before()-created fixture — in one transaction
 * that only rolls back once the describe finishes. Composes with
 * transactionPerTest() as a nested savepoint.
 *
 * Pass { skipIndividualTransaction: true } for a describe whose it()s
 * deliberately chain state (each one depends on a mutation the previous
 * one made) — this keeps the describe isolated from the rest of the suite,
 * while letting its own it()s share the same uncommitted state as if
 * transactionPerTest() weren't wrapping each of them separately.
 */
export function transactionPerDescribe({
  skipIndividualTransaction = false,
}: { skipIndividualTransaction?: boolean } = {}): void {
  let previousKnex: TransactionOrKnex
  let trx: Transaction
  // Tracks whether *this* call actually started a transaction that it now
  // owns and must tear down — rather than re-checking isSkipped() in the
  // teardown hook, which would be thrown off by this same function's own
  // skipIndividualTransaction increment below.
  let started = false

  before(async function () {
    if (isSkipped()) return
    started = true
    previousKnex = BaseModel.knex()
    trx = await transaction.start(BaseModel)
    BaseModel.knex(trx)
  })

  after(async function () {
    if (!started) return
    // rollback() can itself throw (e.g. the transaction was already aborted
    // by a query error during the describe) — knex() must still be restored,
    // or every model stays bound to a dead transaction for the rest of the run.
    try {
      await trx.rollback()
    } finally {
      BaseModel.knex(previousKnex ?? database)
    }
  })

  if (skipIndividualTransaction) {
    before(function () {
      skipDepth++
    })

    after(function () {
      skipDepth--
    })
  }
}
```

## `runInSavepoint()`

```ts
import { transaction, type Transaction } from "objection";

import { BaseModel } from "shared/models/base-model";

/**
 * Runs `fn` inside its own savepoint — a nested transaction if `trx` (or the
 * model's current connection) is already inside one — committing it on
 * success and rolling it back on failure before rethrowing.
 *
 * Use this to wrap a DB operation that might deliberately fail (e.g. a
 * constraint violation you catch and recover from) so the failure can't
 * leave an ambient caller-supplied or test transaction aborted for whatever
 * runs next on the same connection — a plain try/catch around the operation
 * isn't enough, since Postgres aborts the whole enclosing transaction on any
 * query error until an explicit rollback (full or to a savepoint) runs.
 */
export async function runInSavepoint<T>(
  fn: (trx: Transaction) => Promise<T>,
  trx?: Transaction,
): Promise<T> {
  const savepoint = await transaction.start(trx ?? BaseModel);

  try {
    const result = await fn(savepoint);
    await savepoint.commit();
    return result;
  } catch (error) {
    await savepoint.rollback();
    throw error;
  }
}
```

## `nextCreatedAt()`

```ts
/**
 * Returns a Date guaranteed to be later than any previous call in this
 * process. Postgres's now() (the default for most createdAt columns)
 * resolves to the current transaction's start time, so rows inserted
 * within the same test transaction can otherwise end up with an
 * identical createdAt — breaking anything that orders or asserts on
 * "most recently created". Use this as a factory's default createdAt
 * (still overridable by an explicit value) wherever call order matters.
 */
let lastMs = 0;

export const nextCreatedAt = (): Date => {
  lastMs = Math.max(Date.now(), lastMs + 1);
  return new Date(lastMs);
};
```

## ESLint rule: `require-transaction-wrapper-for-before`

```js
"use strict";

// A describe()-level before() hook runs before mocha's per-test transaction
// starts (transactionPerTest() only wraps beforeEach/it/afterEach), so
// anything it creates is written for real, on the raw connection, and is
// never rolled back. See docs/transactional-testing.md
// ("Gotcha: a describe()-level before() without transactionPerDescribe()
// leaks real writes") for the full explanation, and
// backfill-close-case-tasks.tests.ts's git history for a real incident this
// caused.
//
// This rule requires transactionPerDescribe() or skipTransactionWrapping()
// as a direct statement in the same describe() as the before(), or in an
// ancestor describe() — either genuinely fixes the leak. skipTransactionWrapping()
// is the sanctioned escape hatch for a before() that really does need to run
// for real (it takes a required reason string, and cleans up afterwards).
//
// A before() that never touches the database (e.g. it only sets up a sinon
// stub, builds a plain object, or runs schema DDL that must survive
// rollback) doesn't need either wrapper — silence this rule with a standard
// ESLint disable comment instead. For a single before():
//   // eslint-disable-next-line require-transaction-wrapper-for-before
//   before(() => { someStub = stub(someModule, 'someMethod') })
// For a whole describe() of them (or one with several nested describes,
// each with their own before()), use a disable/enable block instead of
// repeating the comment on every before():
//   describe('a group of hooks that never touch the database', () => {
//     /* eslint-disable require-transaction-wrapper-for-before */
//     before(() => { ... })
//     describe('nested', () => {
//       before(() => { ... })
//     })
//     /* eslint-enable require-transaction-wrapper-for-before */
//   })

const WRAPPER_CALLS = new Set([
  "transactionPerDescribe",
  "skipTransactionWrapping",
]);

const isDescribeCall = (node) => {
  if (!node || node.type !== "CallExpression") return false;
  const callee = node.callee;
  if (callee.type === "Identifier" && callee.name === "describe") return true;
  return (
    callee.type === "MemberExpression" &&
    callee.object.type === "Identifier" &&
    callee.object.name === "describe"
  );
};

const getDescribeBodyStatements = (describeCallNode) => {
  const args = describeCallNode.arguments;
  const fn = args[args.length - 1];
  if (
    !fn ||
    (fn.type !== "ArrowFunctionExpression" && fn.type !== "FunctionExpression")
  ) {
    return null;
  }
  if (fn.body.type !== "BlockStatement") return null;
  return fn.body.body;
};

const isWrapperCallStatement = (statement) => {
  if (statement.type !== "ExpressionStatement") return false;
  const expr = statement.expression;
  return (
    expr.type === "CallExpression" &&
    expr.callee.type === "Identifier" &&
    WRAPPER_CALLS.has(expr.callee.name)
  );
};

const findWrapperStatementIndex = (statements) =>
  statements.findIndex(isWrapperCallStatement);

// Finds the index, within `statements`, of whichever statement contains
// `node` — i.e. the top-level statement in this describe() body that the
// before() call is (part of).
const findContainingStatementIndex = (statements, node) => {
  let current = node;
  while (current) {
    const index = statements.indexOf(current);
    if (index !== -1) return index;
    current = current.parent;
  }
  return -1;
};

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "require transactionPerDescribe() or skipTransactionWrapping() alongside a describe-level before() hook, so its writes are rolled back instead of leaking onto the real database",
    },
    schema: [],
    messages: {
      missingWrapper:
        "This before() hook runs before mocha's per-test transaction starts, so it writes for real and is never rolled back — it can leak into unrelated later tests. Add transactionPerDescribe() (or skipTransactionWrapping('reason') if it genuinely needs to run for real) as the first statement in this describe() or an ancestor describe(). If this before() never touches the database, silence this rule with a disable comment instead (see the top of this rule's file for the describe-level block form). See docs/transactional-testing.md.",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          !(node.callee.type === "Identifier" && node.callee.name === "before")
        ) {
          return;
        }

        let current = node.parent;
        let foundDescribe = false;
        // Only the nearest enclosing describe() needs its wrapper call to
        // come *before* this before() in registration order — mocha runs
        // sibling hooks within one describe in the order they're
        // registered, so a wrapper registered after the fixture's before()
        // doesn't wrap it. Any ancestor beyond that protects regardless of
        // where in its own body the wrapper appears, since mocha always
        // finishes every one of a parent's own hooks before it starts
        // running hooks in a child describe.
        let requireOrderingHere = true;
        while (current) {
          if (isDescribeCall(current)) {
            foundDescribe = true;
            const statements = getDescribeBodyStatements(current);
            if (statements) {
              const wrapperIndex = findWrapperStatementIndex(statements);
              if (wrapperIndex !== -1) {
                if (!requireOrderingHere) {
                  return;
                }
                const beforeIndex = findContainingStatementIndex(
                  statements,
                  node,
                );
                if (beforeIndex !== -1 && wrapperIndex < beforeIndex) {
                  return;
                }
              }
            }
            requireOrderingHere = false;
          }
          current = current.parent;
        }

        if (foundDescribe) {
          context.report({ node, messageId: "missingWrapper" });
        }
      },
    };
  },
};
```
