# Repository guidance

This repository tests Sauce Demo with Playwright and TypeScript. See `README.md`
for coverage and `package.json` for the available Yarn commands.

## Adding coverage

When adding or extending E2E scenarios, read and use
`.agents/skills/add-e2e-test/SKILL.md`.

## Code conventions

- Import `test` and `expect` in specs from `src/fixtures/test.fixture.ts`.
  Reuse its page objects, `authenticatedPage`, and `checkoutFlow` fixtures.
- Keep page locators and page-specific interactions in `src/pages/`; reusable
  business journeys belong in `src/flows/`. Extend existing abstractions only
  when the scenario needs it.
- Reuse typed products, users, and checkout data from `src/constants/` and
  `src/types/testData.ts`, and domain assertions from `src/utils/`.
- Prefer `getByTestId` for available stable IDs: Playwright maps these to
  `data-test`, not `data-testid`. Scope product locators to the relevant item.
- Preserve test isolation: tests run fully in parallel and each test owns its
  browser context. Do not rely on another test's login, cart, or execution order.
- Use Playwright's auto-waiting assertions. Do not hide failures with arbitrary
  sleeps, weakened assertions, or increased retries.
- Keep feature tags (`@login`, `@inventory`, `@detail`, `@cart`, `@checkout`,
  `@smoke`) and category tags (`@positive`, `@negative`) consistent with nearby
  tests. `problem_user` scenarios are excluded from the regular suite; change
  that scope only when requested.

## Verification

For TypeScript or test changes, run `yarn type-check`, check formatting of the
changed files, and run the affected specs. Include affected consumers when
changing shared page objects, fixtures, flows, or assertions. Use `yarn test`
when the change affects the whole suite.

Documentation-only changes need formatting checks, not browser tests. Report
what ran and any execution limitations; do not claim a blocked test passed.
