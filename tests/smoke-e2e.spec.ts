import { test, expect } from '../src/fixtures/test.fixture';
import { FILTER_OPTIONS } from '../src/constants/enums';
import checkoutData from '../src/constants/checkoutData';
import {
  SAUCE_LABS_BACKPACK,
  SAUCE_LABS_BIKE_LIGHT,
} from '../src/constants/products';

test.describe('Smoke E2E Flows @smoke', () => {
  test('should complete full checkout flow: login, add products, checkout, and logout @smoke', async ({
    authenticatedPage: inventoryPage,
    loginPage,
    checkoutFlow,
  }) => {
    await inventoryPage.sortBy(FILTER_OPTIONS.NAME_A_TO_Z);
    const checkoutCompletePage = await checkoutFlow.completeOrder(
      [SAUCE_LABS_BACKPACK, SAUCE_LABS_BIKE_LIGHT],
      checkoutData
    );
    await checkoutCompletePage.backHomeButton.click();
    await inventoryPage.assertLoaded();
    await inventoryPage.sidebarMenu.click();
    await inventoryPage.logoutLink.click();
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('should complete checkout flow with product added from detail page @smoke', async ({
    authenticatedPage: inventoryPage,
    loginPage,
    inventoryDetailsPage,
    cartPage,
    checkoutFlow,
  }) => {
    await inventoryPage.goToProductDetail(SAUCE_LABS_BACKPACK.name);
    await inventoryDetailsPage.assertLoaded();
    await inventoryDetailsPage.addToCartButton.click();
    await inventoryPage.cartLink.click();
    await cartPage.assertLoaded();
    await checkoutFlow.openStepOneFromCart();
    await checkoutFlow.openStepTwoFromCurrentStep(checkoutData);
    const checkoutCompletePage = await checkoutFlow.completeOrderFromOverview();
    await checkoutCompletePage.backHomeButton.click();
    await inventoryPage.assertLoaded();
    await inventoryPage.sidebarMenu.click();
    await inventoryPage.logoutLink.click();
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('should handle product management flow: add, remove, and navigate between pages @smoke', async ({
    authenticatedPage: inventoryPage,
    loginPage,
    inventoryDetailsPage,
    cartPage,
    checkoutFlow,
  }) => {
    await inventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
    await inventoryPage.addProductToCart(SAUCE_LABS_BIKE_LIGHT.name);
    await inventoryPage.cartLink.click();
    await cartPage.assertLoaded();
    await cartPage.removeProduct(SAUCE_LABS_BIKE_LIGHT.name);
    await cartPage.continueShoppingButton.click();
    await inventoryPage.assertLoaded();
    await inventoryPage.goToProductDetail(SAUCE_LABS_BIKE_LIGHT.name);
    await inventoryDetailsPage.addToCartButton.click();
    await inventoryDetailsPage.removeFromCartButton.click();
    await inventoryDetailsPage.backButton.click();
    await inventoryPage.assertLoaded();
    await inventoryPage.cartLink.click();
    await cartPage.assertLoaded();
    await checkoutFlow.openStepOneFromCart();
    const checkoutStepTwoPage =
      await checkoutFlow.openStepTwoFromCurrentStep(checkoutData);
    await checkoutStepTwoPage.cancelButton.click();
    await inventoryPage.assertLoaded();
    await inventoryPage.sidebarMenu.click();
    await inventoryPage.logoutLink.click();
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
