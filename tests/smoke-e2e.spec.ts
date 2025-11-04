import { test, expect } from '../src/fixtures/test.fixture';
import { FILTER_OPTIONS } from '../src/constants/enums';
import { STANDARD_USER } from '../src/constants/users';
import checkoutData from '../src/constants/checkoutData';
import {
  SAUCE_LABS_BACKPACK,
  SAUCE_LABS_BIKE_LIGHT,
} from '../src/constants/products';

test.describe('Smoke E2E Flows @smoke', () => {
  test('login, add products to cart, checkout, logout', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    await loginPage.goto();
    await loginPage.usernameInput.fill(STANDARD_USER.username);
    await loginPage.passwordInput.fill(STANDARD_USER.password);
    await loginPage.loginButton.click();
    await inventoryPage.assertLoaded();
    await inventoryPage.sortBy(FILTER_OPTIONS.NAME_A_TO_Z);
    await inventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
    await inventoryPage.addProductToCart(SAUCE_LABS_BIKE_LIGHT.name);
    await inventoryPage.cartLink.click();
    await cartPage.assertLoaded();
    await cartPage.checkoutButton.click();
    await checkoutStepOnePage.assertLoaded();
    await checkoutStepOnePage.fillCheckoutForm(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutStepOnePage.continueButton.click();
    await checkoutStepTwoPage.assertLoaded();
    await checkoutStepTwoPage.finishButton.click();
    await checkoutCompletePage.assertLoaded();
    await checkoutCompletePage.backHomeButton.click();
    await inventoryPage.assertLoaded();
    await inventoryPage.sidebarMenu.click();
    await inventoryPage.logoutLink.click();
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
