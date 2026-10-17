---
name: add-e2e-test
description: Add or extend Swag Labs Playwright E2E scenarios using this repository's page objects, fixtures, flows, test data, and tags. Use for new regression coverage or additional validation cases.
---

# Add E2E coverage

Implement the requested behavior as an isolated, observable test, following the
repository's existing abstractions.

## Find the right place

Read the relevant spec in `tests/` and its page objects before editing. Check
whether the requested behavior already has coverage. Extend an existing spec
for page-level behavior; use `tests/smoke-e2e.spec.ts` for critical journeys
across pages. Avoid duplicating a full journey just to reach the page under test.

Inspect `src/fixtures/test.fixture.ts` and, for checkout scenarios,
`src/flows/CheckoutFlow.ts` to choose setup:

- `authenticatedPage` provides an inventory page after standard-user login.
  Login scenarios should use `loginPage` and the requested user's credentials.
- `checkoutFlow.openStepOne(products)` reaches the customer form;
  `openStepTwo(products, customer)` reaches the overview;
  `completeOrder(products, customer)` completes the purchase.
- Flow methods ending in `FromCart`, `FromCurrentStep`, or `FromOverview` can
  continue a journey already in progress. Check their implementation and current
  cart/page state before using them; the setup methods add products themselves.

## Implement the scenario

Import `test` and `expect` from `src/fixtures/test.fixture.ts`. Request the
fixtures needed by the scenario instead of constructing page objects in specs.
Reuse existing product/user constants and typed checkout data. Put reusable
datasets alongside the relevant constants; a small spec-local validation table
is also consistent with `tests/login.spec.ts`.

Keep new locators and page operations in the appropriate page object. Reuse
`src/utils/` assertions when they express the expected outcome. Direct assertions
against exposed page-object locators are also used in this suite; do not create
a wrapper for every assertion.

Give each scenario a distinct, behavior-focused title. Follow nearby feature
and positive/negative tags, including inherited tags on `test.describe`. For
data-driven validation, emit a separately named test per case.

Assert the requested outcome, not just that an action completed. For example,
removing a product should verify its absence and any relevant remaining cart
state. Keep expected values independent from the UI values being checked.
Use an existing flow for setup, but exercise the actual action under test in the
scenario so the setup does not bypass it.

## Verify and hand off

- Run `yarn type-check` and
  `yarn prettier --check <changed-files>`.
- Run `yarn test tests/<affected-file>.spec.ts`. Include other affected specs
  when shared code changes; run the full suite for suite-wide changes.
- If execution fails, distinguish a test/application failure from a missing
  browser or unavailable environment. Preserve useful failure evidence and
  report the limitation rather than weakening the test to make it pass.

Report the coverage added, any supporting abstraction changes, and the commands
and results used to verify it.
