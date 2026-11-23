import { test as base } from '@playwright/test';
import LoginPage from '../pages/Login/LoginPage';
import InventoryPage from '../pages/Inventory/InventoryPage';
import CartPage from '../pages/Cart/CartPage';
import { CheckoutStepOnePage } from '../pages/Checkout/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/Checkout/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/Checkout/CheckoutCompletePage';
import { STANDARD_USER } from '../constants/users';
import InventoryDetailsPage from '../pages/Inventory/InventoryDetailsPage';
import DynamicCatalogPage from '../pages/Catalog/DynamicCatalogPage';

export type PageObjects = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  inventoryDetailsPage: InventoryDetailsPage;
  cartPage: CartPage;
  dynamicCatalogPage: DynamicCatalogPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
};

export type TestFixtures = {
  loggedInInventoryPage: InventoryPage;
};

export const test = base.extend<PageObjects & TestFixtures>({
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
  dynamicCatalogPage: async ({ page }, use) => {
    await use(new DynamicCatalogPage(page));
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

  // Most commonly used application state
  loggedInInventoryPage: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await inventoryPage.assertLoaded();
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
