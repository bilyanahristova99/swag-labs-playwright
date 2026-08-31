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

export type StateFixtures = {
  authenticatedPage: InventoryPage;
  checkoutStepOneReady: CheckoutStepOnePage;
  checkoutStepTwoReady: CheckoutStepTwoPage;
};

export const test = base.extend<PageObjects & StateFixtures>({
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

  // Ready-to-use application states
  authenticatedPage: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await inventoryPage.assertLoaded();
    await use(inventoryPage);
  },

  checkoutStepOneReady: async (
    { authenticatedPage, cartPage, checkoutStepOnePage },
    use
  ) => {
    await authenticatedPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
    await authenticatedPage.assertCartItemCount(1);
    await authenticatedPage.cartLink.click();
    await cartPage.assertLoaded();
    await cartPage.checkoutButton.click();
    await checkoutStepOnePage.assertLoaded();
    await use(checkoutStepOnePage);
  },

  checkoutStepTwoReady: async (
    { checkoutStepOneReady, checkoutStepTwoPage },
    use
  ) => {
    await checkoutStepOneReady.fillCheckoutForm(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutStepOneReady.continueButton.click();
    await checkoutStepTwoPage.assertLoaded();
    await use(checkoutStepTwoPage);
  },
});

export { expect } from '@playwright/test';
