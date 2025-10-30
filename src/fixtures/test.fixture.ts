import { test as base } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/Inventory/InventoryPage';
import CartPage from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/Checkout/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/Checkout/CheckoutStepTwoPage';
import { STANDARD_USER } from '../constants/users';
import { SAUCE_LABS_BACKPACK } from '../constants/products';
import checkoutData from '../constants/checkoutData';

type PageObjects = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
};

type FlowFixtures = {
  loggedIn: void;
  checkoutStepOneReady: void;
  checkoutStepTwoReady: void;
};

const test = base.extend<PageObjects & FlowFixtures>({
  // Page object fixtures
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutStepOnePage: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page));
  },
  checkoutStepTwoPage: async ({ page }, use) => {
    await use(new CheckoutStepTwoPage(page));
  },

  // Flows
  loggedIn: [
    async ({ loginPage, inventoryPage }, use) => {
      await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
      await loginPage.verifyAuthenticationSuccess();
      await inventoryPage.assertLoaded();
      await use();
    },
    { auto: true }, // auto-run for suites that import this test
  ],

  checkoutStepOneReady: async (
    { inventoryPage, cartPage, checkoutStepOnePage },
    use
  ) => {
    await inventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
    await inventoryPage.assertCartItemCount(1);
    await cartPage.goto();
    await cartPage.assertLoaded();
    await cartPage.checkoutButton.click();
    await checkoutStepOnePage.assertLoaded();
    await use();
  },

  checkoutStepTwoReady: async (
    { checkoutStepOneReady, checkoutStepOnePage, checkoutStepTwoPage },
    use
  ) => {
    // depends on checkoutStepOneReady having prepared the state
    void checkoutStepOneReady; // ensure fixture is initialized
    await checkoutStepOnePage.fillCheckoutForm(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutStepOnePage.continueButton.click();
    await checkoutStepTwoPage.assertLoaded();
    await use();
  },
});

// Re-export expect for cleaner test assertions
export const expect = test.expect;
export default test;
