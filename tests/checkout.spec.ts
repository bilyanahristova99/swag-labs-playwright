import { test, expect } from '../src/fixtures/test.fixture';
import checkoutData from '../src/constants/checkoutData';
import { SAUCE_LABS_BACKPACK } from '../src/constants/products';

test.describe('Checkout Process @checkout', () => {
  test.describe('Checkout Step One Page @checkout', () => {
    const emptyFirstNameError = 'First Name is required';
    const emptyLastNameError = 'Last Name is required';
    const emptyPostalCodeError = 'Postal Code is required';

    test.beforeEach(async ({ checkoutStepOneReady }) => {
      // Prepares: logged in, item added, at checkout step one
      await checkoutStepOneReady();
    });

    test('should navigate to checkout step two when valid checkout data is submitted @positive', async ({
      checkoutStepTwoPage,
      checkoutStepOnePage,
    }) => {
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

    test('should display error message when first name is missing @negative', async ({
      checkoutStepOnePage,
    }) => {
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

    test('should display error message when last name is missing @negative', async ({
      checkoutStepOnePage,
    }) => {
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

    test('should display error message when postal code is missing @negative', async ({
      checkoutStepOnePage,
    }) => {
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

    test('should navigate back to cart when cancel button is clicked @positive', async ({
      checkoutStepOnePage,
      cartPage,
    }) => {
      await expect(checkoutStepOnePage.cancelButton).toBeVisible();
      await expect(checkoutStepOnePage.cancelButton).toBeEnabled();
      await checkoutStepOnePage.cancelButton.click();
      await cartPage.assertLoaded();
    });
  });

  test.describe('Checkout Step Two Page @checkout', () => {
    test.beforeEach(async ({ checkoutStepTwoReady }) => {
      // Prepares: logged in, item added, step one filled, at step two
      await checkoutStepTwoReady();
    });

    test('should display correct product details for items in checkout summary @positive', async ({
      checkoutStepTwoPage,
    }) => {
      await checkoutStepTwoPage.assertProductDetails(
        SAUCE_LABS_BACKPACK.name,
        SAUCE_LABS_BACKPACK.price,
        SAUCE_LABS_BACKPACK.description
      );
    });

    test('should calculate and display correct total price including tax @positive', async ({
      checkoutStepTwoPage,
    }) => {
      const productPrices = [SAUCE_LABS_BACKPACK.price];
      const expectedTotal =
        await checkoutStepTwoPage.calculateExpectedTotal(productPrices);
      const actualTotal = await checkoutStepTwoPage.getTotalPrice();

      expect(actualTotal).toBe(expectedTotal);
    });

    test('should navigate back to inventory page when cancel button is clicked @positive', async ({
      checkoutStepTwoPage,
      inventoryPage,
    }) => {
      await expect(checkoutStepTwoPage.cancelButton).toBeVisible();
      await expect(checkoutStepTwoPage.cancelButton).toBeEnabled();
      await checkoutStepTwoPage.cancelButton.click();
      await inventoryPage.assertLoaded();
      await inventoryPage.assertCartItemCount(1);
    });

    test('should navigate to checkout complete page when finish button is clicked @positive', async ({
      checkoutStepTwoPage,
      checkoutCompletePage,
    }) => {
      await expect(checkoutStepTwoPage.finishButton).toBeVisible();
      await expect(checkoutStepTwoPage.finishButton).toBeEnabled();
      await checkoutStepTwoPage.finishButton.click();
      await checkoutCompletePage.assertLoaded();
    });
  });
});
