# Swag Labs E2E Tests (Playwright + TypeScript)

This project contains end‑to‑end tests for Sauce Demo (Swag Labs) using Playwright and TypeScript. It follows a clean Page Object Model and uses simple tags to run focused suites.

## Quick start

Prerequisites: Node.js, Yarn.

```bash
# 1) Install dependencies
yarn install

# 2) Install Playwright browsers
yarn test:install

# 3) Run all tests (headless)
yarn test
```

Useful variants:

```bash
# See the browser while tests run
yarn test:headed

# Open the Playwright debugger
yarn test:debug

# Run by feature
yarn test:login
yarn test:inventory
yarn test:inventory-details
yarn test:cart
yarn test:checkout

# Run by category
yarn test:positive
yarn test:negative
```

## How it’s organized

```
src/
  pages/            # Page Objects (BasePage, Login, Inventory, Cart, Checkout*)
  interfaces/       # TS interfaces that define page contracts
  constants/        # Users, products, checkout data, enums, shared selectors
  fixtures/         # Project fixtures (e.g., test.fixture.ts)
tests/              # Specs: login, inventory, details, cart, checkout
```

- Base URL is set in `playwright.config.ts` to `https://www.saucedemo.com/v1/`.
- Reports are generated in `playwright-report/` after each run.

## Approach

- Page Object Model keeps locators and actions in one place.
- TypeScript interfaces document expected page capabilities.
- Tests are tagged (e.g., `@login`, `@inventory`, `@cart`, `@checkout`, `@detail`, `@positive`, `@negative`) so you can run exactly what you need.

## Developer helpers

```bash
# Format code
yarn format

# Check formatting
yarn format:check

# Clean install
yarn clean:install
```

## Reports

Open `playwright-report/index.html` to view the HTML report with steps, screenshots, and traces.
