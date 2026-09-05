# Swag Labs E2E Tests

End-to-end test automation suite for Sauce Demo (Swag Labs) using Playwright and TypeScript. Follows the Page Object Model pattern for maintainability.

## Quick Start 🚀

Prerequisites: Node.js, Yarn.

```bash
# Install dependencies and browsers
yarn install
yarn test:install

# Run all tests (headless)
yarn test
```

### Running Tests

```bash
yarn test:headed          # See browser while tests run
yarn test:debug           # Open Playwright debugger
yarn test:smoke           # End-to-end smoke tests
yarn test:login           # Run by feature
yarn test:inventory
yarn test:cart
yarn test:checkout
yarn test:positive        # Happy path tests
yarn test:negative        # Error handling tests
```

## Project Structure 📁

```text
src/
  constants/          # Test data, product information, enums, and selectors
  fixtures/           # Page object, flow, and application-state fixtures
  flows/              # Parameterized reusable business journeys
  interfaces/         # Shared TypeScript page contracts
  pages/              # Page Object Model classes grouped by feature
    BasePage.ts
    Login/
    Inventory/
    Cart/
    Checkout/
  types/              # Shared TypeScript models for test data
  utils/              # Reusable domain-specific assertion helpers

tests/
  login.spec.ts
  inventory.spec.ts
  inventoryDetails.spec.ts
  cart.spec.ts
  checkout.spec.ts
  smoke-e2e.spec.ts
```

Base URL: `https://www.saucedemo.com/` (configured in `playwright.config.ts`). Reports are generated in `playwright-report/` after each run.

## Test Users Available 👥

- **`standard_user`** - Main user for happy path tests. Everything works normally.

- **`locked_out_user`** - Locked account, used to test error handling for locked users.

- **`performance_glitch_user`** - Experiences slower page loads. Used to verify login still works with performance issues.

- **`problem_user`** - Has known bugs (images don't load, cart issues, etc.). **Not used in automated tests** (would cause failures), but credentials are available in `src/constants/users.ts` for manual exploration.

## What's Automated ✅/❌

### Currently Automated

- **Login page**: Valid logins and data-driven error handling (empty fields, wrong credentials, locked out user)
- **Inventory page**: Product listing, sorting, adding items to cart
- **Product details page**: Viewing product info, adding items from detail page
- **Shopping cart**: Viewing contents, removing items, navigating to checkout
- **Checkout flow**: Data-driven form validation, product summary, price calculation, navigation, and successful completion
- **Smoke E2E tests**: Full end-to-end journeys covering critical user flows (login → browse → checkout → logout)

All tests are tagged with feature tags (`@login`, `@inventory`, `@cart`, `@checkout`, `@detail`, `@smoke`) and category tags (`@positive`, `@negative`).

### Not Currently Automated

- **Problem user scenarios** - Intentionally excluded to keep the test suite stable.
- **Multi-browser testing** - Only Chromium is configured, but easy to add more browsers.

## Approach & Strategy 🏗️

The suite follows the **Page Object Model** pattern, with typed test data, reusable business flows, and custom Playwright fixtures. Tests are tagged for easy filtering.

**Page-specific specs** (current)

- Detailed tests for individual pages and features
- Thorough validation: UI elements, data, error handling, edge cases

**Smoke E2E flows** (implemented)

- Quick end-to-end journeys for critical paths (login → browse → checkout → logout)
- Covers navigation between pages, adding/removing products, and complete checkout flows
- Fast and stable, perfect for PR runs

### Fixtures & Test State 🧩

The suite uses custom Playwright fixtures to provide page objects and reusable application states.

**Page object fixtures**

- Create page objects using Playwright's test-scoped `page`
- Are initialized only when requested by a test
- Share the same isolated browser context within each test

**Flow and state fixtures**

- `authenticatedPage` - Logs in with the standard user and provides a ready inventory page
- `checkoutFlow` - Provides parameterized checkout journeys for one or multiple products and different customer data

Fixtures are composed through dependencies:

```text
authenticatedPage
        ↓
checkoutFlow
```

Each test receives a fresh browser context, so cart contents, authentication, and application state are not shared between tests.

### Parameterized Flows & Test Data 🔄

`CheckoutFlow` separates reusable business journeys from individual page objects. Tests can open a specific checkout step or complete an order by supplying one product, multiple products, and typed customer data:

```ts
await checkoutFlow.openStepOne(SAUCE_LABS_BACKPACK);

await checkoutFlow.openStepTwo(
  [SAUCE_LABS_BACKPACK, SAUCE_LABS_BIKE_LIGHT],
  checkoutData
);

await checkoutFlow.completeOrder(SAUCE_LABS_BACKPACK, checkoutData);
```

Related login and checkout validation scenarios are generated from typed datasets. Each dataset entry is still reported as an individual Playwright test, keeping the report readable while avoiding duplicated test logic.

### Execution Strategy ⚙️

Tests run fully in parallel locally for faster feedback. Playwright automatically selects the available worker count.

In CI:

- Tests are split into feature-based jobs
- Each job uses one Playwright worker
- Failed tests are retried once
- Traces are collected on the first retry
- Screenshots and videos are retained for failures
- The HTML report is generated without opening automatically

The application uses `data-test` attributes as Playwright test IDs, configured globally in `playwright.config.ts`:

```ts
testIdAttribute: 'data-test';
```

This keeps locators stable and independent from visual CSS changes.

## Potential Improvements 💡

- **Stronger page contracts**: Validate URLs, key page content, and image loading inside page assertions
- **Multi-browser coverage**: Add Firefox and WebKit projects when broader compatibility testing is needed

These are future enhancements rather than gaps in the current functional E2E scope.

## Developer Helpers 🛠️

```bash
yarn type-check          # Run TypeScript validation
yarn format              # Format the project with Prettier
yarn format:check        # Verify formatting without modifying files
yarn clean:install       # Reinstall dependencies from a clean state
```

Prettier + Husky with lint-staged ensure code is formatted before commits. Type checking runs automatically on pre-commit.

## Viewing Test Reports 📈

Open `playwright-report/index.html` to see detailed HTML reports with:

- Test results (pass/fail)
- Step-by-step execution
- Screenshots and videos (for failures)
- Playwright traces for debugging
