# Swag Labs E2E Tests

This is an end-to-end test automation suite for the Sauce Demo (Swag Labs) e-commerce application. I'm using Playwright with TypeScript to test the full user journey from login to checkout completion. The project follows the Page Object Model pattern to keep things organized and maintainable.

## What I'm Testing 🧪

Sauce Demo is a demo e-commerce site where users can log in, browse products, add items to their cart, and complete a checkout flow. My test suite covers all the major user journeys and edge cases to ensure everything works as expected.

## Quick Start 🚀

You'll need Node.js and Yarn installed. Then:

```bash
# 1) Install dependencies
yarn install

# 2) Install Playwright browsers
yarn test:install

# 3) Run all tests (headless)
yarn test
```

### Running Tests

I've set up convenient scripts to run tests in different ways:

```bash
# See the browser while tests run (great for debugging)
yarn test:headed

# Open the Playwright debugger (step through tests interactively)
yarn test:debug

# Run tests by feature area
yarn test:login
yarn test:inventory
yarn test:inventory-details
yarn test:cart
yarn test:checkout

# Run tests by category
yarn test:positive    # Happy path tests
yarn test:negative    # Error handling and edge cases
```

## Project Structure 📁

Here's how things are organized:

```
src/
  pages/              # Page Object classes - each page in the app has its own class
    BasePage.ts       # Base class with common navigation and load utilities
    Login/            # Login page
    Inventory/        # Product listing and product details pages
    Cart/             # Shopping cart page
    Checkout/         # Checkout step one, step two, and completion pages
  interfaces/         # TypeScript interfaces that define what each page should implement
  constants/          # All the static data I use in tests
    users.ts          # User credentials (more on this below)
    products.ts       # Product data and selectors
    checkoutData.ts   # Test data for checkout forms
    enums.ts          # Shared enums
    selectors/        # Shared CSS selectors
  fixtures/           # Playwright fixtures - reusable test setup
tests/                # The actual test specifications
  login.spec.ts       # Login page tests
  inventory.spec.ts   # Product listing tests
  inventoryDetails.spec.ts  # Product detail page tests
  cart.spec.ts        # Shopping cart tests
  checkout.spec.ts    # Checkout flow tests
  smoke-e2e.spec.ts   # End-to-end smoke tests (currently stubbed out)
```

The base URL is configured in `playwright.config.ts` and points to `https://www.saucedemo.com/v1/`. Test reports with screenshots, videos, and traces are generated in the `playwright-report/` directory after each run.

## Test Users Available 👥

The Sauce Demo application comes with four different user accounts, each with different behaviors:

- **`standard_user`** - This is my main user for happy path tests. Everything works normally with this account. I use it for most of my positive test cases.

- **`locked_out_user`** - This user account has been locked out of the system. I use it to test that the application properly handles locked accounts and shows the appropriate error message.

- **`performance_glitch_user`** - This user experiences slower page loads and network delays. I've included a test to verify that the login still works correctly even with performance issues.

- **`problem_user`** - This is where things get interesting. The problem user has known issues in the application - images might not load correctly, items might not be added to cart properly, or other quirks. **I don't use this user in my automated tests because it would cause tests to fail**, but the credentials are available in `src/constants/users.ts` if you want to manually explore the issues.

## What's Automated and What's Not ✅/❌

### Currently Automated

I have comprehensive test coverage for:

- **Login page**: Valid logins, error handling (empty fields, wrong credentials, locked out user), and performance glitch user scenarios
- **Inventory page**: Product listing, sorting, adding items to cart
- **Product details page**: Viewing individual product information, adding items from the detail page
- **Shopping cart**: Viewing cart contents, removing items, navigating to checkout
- **Checkout flow**: Form validation (all required fields), successful checkout completion

All these tests are tagged with feature tags (`@login`, `@inventory`, `@cart`, `@checkout`, `@detail`) and category tags (`@positive`, `@negative`) so you can easily run specific subsets.

### Not Currently Automated

A few things I haven't implemented yet:

- **Problem user scenarios** - As mentioned above, the `problem_user` account has known bugs that would break tests. I've intentionally avoided automating this user to keep my test suite stable. If you're testing manually, you can use these credentials to explore the issues.

- **Smoke E2E tests** - The `smoke-e2e.spec.ts` file contains placeholder test cases for full end-to-end flows (like "login → browse → add all products → checkout → logout"). These test stubs are there as a reminder of what I want to automate, but they're currently empty. The idea is to have quick, representative happy-path journeys that prove the critical user flows work end-to-end.

- **Multi-browser testing** - Currently I'm only running tests on Chromium. The Playwright config is set up to easily add more browsers if needed.

## My Approach 🏗️

I follow the **Page Object Model** pattern, which means each page in the application has its own class that encapsulates all the locators and actions for that page. This keeps my test code clean and makes it easy to update selectors if the UI changes.

TypeScript interfaces define the "contract" for each page - what methods and properties each page object should have. This gives me type safety and helps document what each page can do.

Tests are tagged with descriptive tags so you can run exactly what you need. Need to test just the checkout flow? Run `yarn test:checkout`. Want to see all the negative test cases? Run `yarn test:negative`.

## Test Strategy 📊

I've organized tests into two complementary layers:

**Page-specific specs** (what I have now)

- These are detailed tests for individual pages and features
- They validate everything thoroughly: UI elements, data, error handling, edge cases
- Great for catching regressions close to where they happen
- Easy to diagnose failures since they're focused on one area

**Smoke E2E flows** (planned for the future)

- Quick end-to-end journeys that prove critical paths work
- Think "can a user actually complete a purchase?" rather than "is every form field validated?"
- These will be fast and stable, perfect for running on every PR
- Keeps the detailed page tests lean while still catching release-blocking issues

## Potential Improvements 💡

As the codebase grows, there are several opportunities to refactor and improve maintainability:

### Centralized Assertion Helpers

- **Multiple element visibility checks**: Methods like `assertLoaded()` in various page classes often check multiple elements for visibility with repeated `expect(...).toBeVisible()` calls. These could be extracted into a centralized helper function like `assertElementsVisible(locators: Locator[])` that can be reused across all page objects.

- **Product details assertions**: The `assertProductDetails()` method pattern appears in multiple page classes (InventoryDetailsPage, CartPage, CheckoutStepTwoPage, InventoryPage) with very similar logic - checking name, price, and description. This could be extracted to a shared utility or helper class to reduce duplication.

### Helper Utilities

- **Assertion utilities**: Create a shared `assertions.ts` or `helpers/assertions.ts` file with common assertion patterns that can be reused across page objects. This would make it easier to maintain consistent assertion behavior and update patterns in one place.

- **Element validation helpers**: Common patterns like validating product images, checking cart badge counts, and verifying form fields could be centralized into reusable helper functions.

These improvements would help reduce code duplication and make the codebase more maintainable as it scales, but they're nice-to-haves rather than blockers for current functionality.

## Developer Helpers 🛠️

```bash
# Format all code with Prettier
yarn format

# Check if code is formatted (useful in CI)
yarn format:check

# Clean install (remove node_modules and reinstall)
yarn clean:install
```

I use Prettier for code formatting and Husky with lint-staged to ensure code is formatted before commits. Type checking runs automatically as part of the pre-commit hook.

## Viewing Test Reports 📈

After running tests, open `playwright-report/index.html` in your browser to see a detailed HTML report. You'll find:

- Test results with pass/fail status
- Step-by-step execution details
- Screenshots of failures
- Video recordings (for failed tests)
- Playwright traces for debugging

This makes it super easy to understand what happened when a test fails and debug the issue.
