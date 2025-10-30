# 🚀 Swag Labs Playwright Test Suite

Welcome to my _Swag Labs_ automation solution!  
This project is your all-access pass to mastering end-to-end testing with **Playwright**, **TypeScript**, and a clean Page Object Model structure.

## 🌟 What’s Inside?

- Lightning-fast Playwright tests for Sauce Demo (Swag Labs)
- Modular Page Objects for clean, maintainable code
- Simple scripts to run, debug, and explore your tests
- Friendly to beginners _and_ power users

## 🧩 Approach

- **Page Object Model (POM)**: Each page has a dedicated class under `src/pages/` encapsulating interactions and assertions for clarity and reuse.
- **Typed contracts**: Lightweight interfaces in `src/interfaces/` (e.g., `IPage`, `ILoginPage`) define consistent capabilities across pages.
- **Selectors and data**: Centralized selectors in `src/constants/selectors/` and test data in `src/constants/` to keep tests readable and maintainable.
- **Test design**: Specs focus on behavior, not implementation. Pages handle the “how,” tests assert the “what.”
- **Deterministic tests**: Prefer explicit waits via Playwright assertions over timeouts. Avoid test coupling and shared state.
- **Reporting & CI**: HTML report generation and GitHub Actions workflow to run tests on push/PR and upload artifacts.
- **Scalability**: Clear naming, small page methods, and single-responsibility functions to grow the suite safely.

Folder highlights:
- `src/pages/` – Page Objects (e.g., `LoginPage`, `InventoryPage`, `CartPage`)
- `src/constants/` – Test data, enums, and shared selectors
- `tests/` – Behavior-focused spec files

## 🚦 Setup

Make sure you have **Yarn** installed:

```bash
# Install Yarn globally (if not already installed)
npm install -g yarn

# Install dependencies
yarn install

# Install Playwright browsers
yarn test:install
```

## 🧪 Running Tests

```bash
# Run all tests
yarn test

# Run tests with UI mode
yarn test:ui

# Run tests in headed mode (see browser)
yarn test:headed

# Run tests in debug mode
yarn test:debug

# Run specific test suites
yarn test:login      # Login tests only
yarn test:positive   # Positive test cases only
yarn test:negative   # Negative test cases only
```

## 🛠️ Development Goodies

```bash
# Format code
yarn format

# Check code formatting
yarn format:check

# Clean and reinstall dependencies
yarn clean:install
```
