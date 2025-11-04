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

```
src/
  pages/              # Page Object classes
    BasePage.ts
    Login/, Inventory/, Cart/, Checkout/
  interfaces/         # TypeScript page contracts
  constants/          # Users, products, selectors, enums
  fixtures/           # Reusable test setup
tests/                # Test specifications
```

Base URL: `https://www.saucedemo.com/v1/` (configured in `playwright.config.ts`). Reports are generated in `playwright-report/` after each run.

## Test Users Available 👥

- **`standard_user`** - Main user for happy path tests. Everything works normally.

- **`locked_out_user`** - Locked account, used to test error handling for locked users.

- **`performance_glitch_user`** - Experiences slower page loads. Used to verify login still works with performance issues.

- **`problem_user`** - Has known bugs (images don't load, cart issues, etc.). **Not used in automated tests** (would cause failures), but credentials are available in `src/constants/users.ts` for manual exploration.

## What's Automated ✅/❌

### Currently Automated

- **Login page**: Valid logins, error handling (empty fields, wrong credentials, locked out user)
- **Inventory page**: Product listing, sorting, adding items to cart
- **Product details page**: Viewing product info, adding items from detail page
- **Shopping cart**: Viewing contents, removing items, navigating to checkout
- **Checkout flow**: Form validation, successful checkout completion
- **Smoke E2E tests**: Full end-to-end journeys covering critical user flows (login → browse → checkout → logout)

All tests are tagged with feature tags (`@login`, `@inventory`, `@cart`, `@checkout`, `@detail`, `@smoke`) and category tags (`@positive`, `@negative`).

### Not Currently Automated

- **Problem user scenarios** - Intentionally excluded to keep the test suite stable.
- **Multi-browser testing** - Only Chromium is configured, but easy to add more browsers.

## Approach & Strategy 🏗️

I follow the **Page Object Model** pattern with TypeScript interfaces defining page contracts. Tests are tagged for easy filtering.

**Page-specific specs** (current)

- Detailed tests for individual pages and features
- Thorough validation: UI elements, data, error handling, edge cases

**Smoke E2E flows** (implemented)

- Quick end-to-end journeys for critical paths (login → browse → checkout → logout)
- Covers navigation between pages, adding/removing products, and complete checkout flows
- Fast and stable, perfect for PR runs

## Potential Improvements 💡

- **Centralized assertion helpers**: Extract repeated `expect(...).toBeVisible()` patterns into reusable helpers (e.g., `assertElementsVisible()`)
- **Shared product details assertions**: The `assertProductDetails()` pattern appears in multiple page classes with similar logic - could be extracted to a utility
- **Assertion utilities**: Create shared helpers for common patterns (product images, cart badges, form fields)

These are nice-to-haves for better maintainability as the codebase scales.

## Developer Helpers 🛠️

```bash
yarn format              # Format code with Prettier
yarn format:check        # Check formatting
yarn clean:install       # Clean install
```

Prettier + Husky with lint-staged ensure code is formatted before commits. Type checking runs automatically on pre-commit.

## Viewing Test Reports 📈

Open `playwright-report/index.html` to see detailed HTML reports with:

- Test results (pass/fail)
- Step-by-step execution
- Screenshots and videos (for failures)
- Playwright traces for debugging
