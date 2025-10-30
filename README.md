# 🚀 Swag Labs Playwright Test Suite

Welcome to my _Swag Labs_ automation solution built with Playwright and TypeScript.

## 🌟 What's Inside?

- Comprehensive Playwright tests for Sauce Demo (Swag Labs) e-commerce application
- Modular Page Object Model with TypeScript for type safety and maintainability
- Organized test structure covering login, inventory, cart, and checkout flows
- Centralized test data and selectors for easy maintenance
- Multiple test execution modes and debugging capabilities

## 🧩 Architecture & Approach

### **Page Object Model (POM)**
- **BasePage**: Abstract base class implementing common page functionality
- **Specialized Pages**: Each page has a dedicated class extending BasePage:
  - `LoginPage` - Authentication and login functionality
  - `InventoryPage` - Product listing, filtering, and selection
  - `InventoryDetailsPage` - Individual product details and actions
  - `CartPage` - Shopping cart management
  - `CheckoutStepOnePage` - Customer information input
  - `CheckoutStepTwoPage` - Order review and confirmation
  - `CheckoutCompletePage` - Order completion confirmation

### **Type Safety & Contracts**
- **Interfaces**: TypeScript interfaces in `src/interfaces/` define page contracts
  - `IPage` - Base page interface with common methods
  - `ILoginPage` - Login-specific functionality contract

### **Centralized Data Management**
- **Test Data**: User credentials, product information, and checkout data in `src/constants/`
- **Selectors**: Reusable CSS selectors organized by functionality in `src/constants/selectors/`
- **Enums**: Type-safe constants for filter options and other fixed values

### **Test Organization**
- **Tagged Tests**: Tests use `@` tags for easy filtering and execution
  - `@login`, `@inventory`, `@cart`, `@checkout`, `@detail`
  - `@positive`, `@negative` for test categorization
- **Behavior-Driven**: Tests focus on user workflows and business logic
- **Deterministic**: Uses Playwright's built-in waiting mechanisms and assertions

### **Project Structure**
```
src/
├── pages/                    # Page Object classes
│   ├── BasePage.ts          # Abstract base page
│   ├── LoginPage.ts         # Login functionality
│   ├── CartPage.ts          # Shopping cart
│   └── Checkout/            # Checkout flow pages
├── interfaces/              # TypeScript interfaces
├── constants/               # Test data and configuration
│   ├── users.ts            # User credentials
│   ├── products.ts         # Product information
│   ├── checkoutData.ts     # Checkout form data
│   ├── enums.ts            # Type-safe constants
│   └── selectors/          # CSS selectors
└── tests/                   # Test specifications
    ├── login.spec.ts       # Authentication tests
    ├── inventory.spec.ts   # Product listing tests
    ├── inventoryDetails.spec.ts # Product detail tests
    ├── cart.spec.ts        # Shopping cart tests
    └── checkout.spec.ts    # Checkout flow tests
```

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

# Run tests in headed mode (see browser)
yarn test:headed

# Run tests in debug mode
yarn test:debug

# Run specific test suites by feature
yarn test:login           # Login functionality tests
yarn test:inventory       # Product listing and filtering tests
yarn test:inventory-details # Product detail page tests
yarn test:cart            # Shopping cart tests
yarn test:checkout        # Checkout flow tests

# Run tests by category
yarn test:positive        # Positive test cases only
yarn test:negative        # Negative test cases only
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

## 📊 Test Reports

After running tests, HTML reports are generated in the `playwright-report/` directory. Open `playwright-report/index.html` in your browser to view detailed test results, screenshots, and traces.
