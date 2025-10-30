import { expect, test } from '@playwright/test';
import LoginPage from '../src/pages/LoginPage';
import InventoryPage from '../src/pages/Inventory/InventoryPage';
import CartPage from '../src/pages/CartPage';
import { CheckoutStepOnePage } from '../src/pages/Checkout/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../src/pages/Checkout/CheckoutStepTwoPage';
import { STANDARD_USER } from '../src/constants/users';
import checkoutData from '../src/constants/checkoutData';
import { SAUCE_LABS_BACKPACK } from '../src/constants/products';

test.describe('Checkout Process @checkout', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;

  test.describe('Checkout Step One Page @checkout', () => {
    const emptyFirstNameError = 'First Name is required';
    const emptyLastNameError = 'Last Name is required';
    const emptyPostalCodeError = 'Postal Code is required';

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      inventoryPage = new InventoryPage(page);
      cartPage = new CartPage(page);
      checkoutStepOnePage = new CheckoutStepOnePage(page);
      checkoutStepTwoPage = new CheckoutStepTwoPage(page);

      // Login first
      await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
      await loginPage.verifyAuthenticationSuccess();
      await inventoryPage.assertLoaded();

      // Add a product to cart
      await inventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
      await inventoryPage.assertCartItemCount(1);

      // Navigate to cart and proceed to checkout
      await cartPage.goto();
      await cartPage.assertLoaded();
      await cartPage.checkoutButton.click();
      await checkoutStepOnePage.assertLoaded();
    });

    test.afterEach(async ({ page }) => {
      await page.close();
    });

    test('fill valid checkout data and continue button is actionable @positive', async () => {
      await expect(checkoutStepOnePage.firstNameInput).toBeVisible();
      await expect(checkoutStepOnePage.lastNameInput).toBeVisible();
      await expect(checkoutStepOnePage.postalCodeInput).toBeVisible();

      await checkoutStepOnePage.fillCheckoutForm(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.postalCode
      );

      await expect(checkoutStepOnePage.continueButton).toBeVisible();
      await expect(checkoutStepOnePage.continueButton).toBeEnabled();
      await checkoutStepOnePage.continueButton.click();
      await checkoutStepTwoPage.assertLoaded();
    });

    test('show error when firstName is missing @negative', async () => {
      await expect(checkoutStepOnePage.firstNameInput).toBeVisible();
      await expect(checkoutStepOnePage.lastNameInput).toBeVisible();
      await expect(checkoutStepOnePage.postalCodeInput).toBeVisible();

      await checkoutStepOnePage.fillCheckoutForm(
        '',
        checkoutData.lastName,
        checkoutData.postalCode
      );

      await expect(checkoutStepOnePage.continueButton).toBeVisible();
      await expect(checkoutStepOnePage.continueButton).toBeEnabled();
      await checkoutStepOnePage.continueButton.click();
      await expect(checkoutStepOnePage.errorMessage).toBeVisible();
      await expect(checkoutStepOnePage.errorMessage).toContainText(
        emptyFirstNameError
      );
    });

    test('show error when lastName is missing @negative', async () => {
      await expect(checkoutStepOnePage.firstNameInput).toBeVisible();
      await expect(checkoutStepOnePage.lastNameInput).toBeVisible();
      await expect(checkoutStepOnePage.postalCodeInput).toBeVisible();

      await checkoutStepOnePage.fillCheckoutForm(
        checkoutData.firstName,
        '',
        checkoutData.postalCode
      );

      await expect(checkoutStepOnePage.continueButton).toBeVisible();
      await expect(checkoutStepOnePage.continueButton).toBeEnabled();
      await checkoutStepOnePage.continueButton.click();
      await expect(checkoutStepOnePage.errorMessage).toBeVisible();
      await expect(checkoutStepOnePage.errorMessage).toContainText(
        emptyLastNameError
      );
    });

    test('show error when postalCode is missing @negative', async () => {
      await expect(checkoutStepOnePage.firstNameInput).toBeVisible();
      await expect(checkoutStepOnePage.lastNameInput).toBeVisible();
      await expect(checkoutStepOnePage.postalCodeInput).toBeVisible();

      await checkoutStepOnePage.fillCheckoutForm(
        checkoutData.firstName,
        checkoutData.lastName,
        ''
      );

      await expect(checkoutStepOnePage.continueButton).toBeVisible();
      await expect(checkoutStepOnePage.continueButton).toBeEnabled();
      await checkoutStepOnePage.continueButton.click();

      await expect(checkoutStepOnePage.errorMessage).toBeVisible();
      await expect(checkoutStepOnePage.errorMessage).toContainText(
        emptyPostalCodeError
      );
    });

    test('cancel button navigates back to cart @positive', async () => {
      await expect(checkoutStepOnePage.cancelButton).toBeVisible();
      await expect(checkoutStepOnePage.cancelButton).toBeEnabled();
      await checkoutStepOnePage.cancelButton.click();
      await cartPage.assertLoaded();
    });
  });

  test.describe('Checkout Step Two Page @checkout', () => {
    test.beforeEach(async ({ page }) => {
      // Setup pages
      loginPage = new LoginPage(page);
      inventoryPage = new InventoryPage(page);
      cartPage = new CartPage(page);
      checkoutStepOnePage = new CheckoutStepOnePage(page);
      checkoutStepTwoPage = new CheckoutStepTwoPage(page);

      // Login first
      await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
      await loginPage.verifyAuthenticationSuccess();
      await inventoryPage.assertLoaded();

      // Add product to cart
      await inventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
      await inventoryPage.assertCartItemCount(1);

      // Navigate to cart and proceed to checkout
      await cartPage.goto();
      await cartPage.assertLoaded();
      await cartPage.checkoutButton.click();
      await checkoutStepOnePage.assertLoaded();

      // Fill checkout form and continue to step two
      await checkoutStepOnePage.fillCheckoutForm(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.postalCode
      );
      await checkoutStepOnePage.continueButton.click();
      await checkoutStepTwoPage.assertLoaded();
    });

    test('validate product details for added products @positive', async () => {
      await checkoutStepTwoPage.assertProductDetails(
        SAUCE_LABS_BACKPACK.name,
        SAUCE_LABS_BACKPACK.price,
        SAUCE_LABS_BACKPACK.description
      );
    });

    test('validate total price for added products @positive', async () => {
      const productPrices = [SAUCE_LABS_BACKPACK.price];
      const expectedTotal =
        await checkoutStepTwoPage.calculateExpectedTotal(productPrices);
      const actualTotal = await checkoutStepTwoPage.getTotalPrice();

      expect(actualTotal).toBe(expectedTotal);
    });

    test('cancel button navigates back to inventory page @positive', async () => {
      await expect(checkoutStepTwoPage.cancelButton).toBeVisible();
      await expect(checkoutStepTwoPage.cancelButton).toBeEnabled();
      await checkoutStepTwoPage.cancelButton.click();
      await inventoryPage.assertLoaded();
      await inventoryPage.assertCartItemCount(1);
    });
  });
});
