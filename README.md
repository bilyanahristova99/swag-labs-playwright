# 🚀 Swag Labs Playwright Test Suite

Welcome to my _Swag Labs_ automation solution!  
This project is your all-access pass to mastering end-to-end testing with **Playwright**, **TypeScript**, and a clean Page Object Model structure.

## 🌟 What’s Inside?

- Lightning-fast Playwright tests for Sauce Demo (Swag Labs)
- Modular Page Objects for clean, maintainable code
- Simple scripts to run, debug, and explore your tests
- Friendly to beginners _and_ power users

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
# Code generation (record new tests)
yarn codegen

# Format code
yarn format

# Check code formatting
yarn format:check

# Lint code
yarn lint

# Clean and reinstall dependencies
yarn clean:install
```
