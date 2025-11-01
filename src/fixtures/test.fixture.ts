import { test as base } from '@playwright/test';
import LoginPage from '../pages/Login/LoginPage';
import InventoryPage from '../pages/Inventory/InventoryPage';
import CartPage from '../pages/Cart/CartPage';
import { CheckoutStepOnePage } from '../pages/Checkout/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/Checkout/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/Checkout/CheckoutCompletePage';
import { STANDARD_USER } from '../constants/users';
import { SAUCE_LABS_BACKPACK } from '../constants/products';
import checkoutData from '../constants/checkoutData';
import InventoryDetailsPage from '../pages/Inventory/InventoryDetailsPage';

export type PageObjects = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  inventoryDetailsPage: InventoryDetailsPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
};

export type FlowFixtures = {
  loggedIn: () => Promise<void>;
  checkoutStepOneReady: () => Promise<void>;
  checkoutStepTwoReady: () => Promise<void>;
};

export const test = base.extend<PageObjects & FlowFixtures>({
  // Page object fixtures
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  inventoryDetailsPage: async ({ page }, use) => {
    await use(new InventoryDetailsPage(page));
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
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  // Flows
  loggedIn: async ({ loginPage, inventoryPage }, use) => {
    await use(async () => {
      await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
      await loginPage.verifyAuthenticationSuccess();
      await inventoryPage.assertLoaded();
    });
  },

  checkoutStepOneReady: async (
    { loggedIn, inventoryPage, cartPage, checkoutStepOnePage },
    use
  ) => {
    await use(async () => {
      await loggedIn();
      await inventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
      await inventoryPage.assertCartItemCount(1);
      await cartPage.goto();
      await cartPage.assertLoaded();
      await cartPage.checkoutButton.click();
      await checkoutStepOnePage.assertLoaded();
    });
  },

  checkoutStepTwoReady: async (
    { checkoutStepOneReady, checkoutStepOnePage, checkoutStepTwoPage },
    use
  ) => {
    await use(async () => {
      await checkoutStepOneReady();
      await checkoutStepOnePage.fillCheckoutForm(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.postalCode
      );
      await checkoutStepOnePage.continueButton.click();
      await checkoutStepTwoPage.assertLoaded();
    });
  },
});

export { expect } from '@playwright/test';
