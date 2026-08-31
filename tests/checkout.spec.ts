import { test, expect } from '../src/fixtures/test.fixture';
import checkoutData from '../src/constants/checkoutData';
import { SAUCE_LABS_BACKPACK } from '../src/constants/products';
import { assertFormFieldsVisible } from '../src/utils/formAssertions';
import { assertButtonState } from '../src/utils/assertions';

test.describe('Checkout Process @checkout', () => {
  test.describe('Checkout Step One Page @checkout', () => {
    const emptyFirstNameError = 'First Name is required';
    const emptyLastNameError = 'Last Name is required';
    const emptyPostalCodeError = 'Postal Code is required';

    test.beforeEach(async ({ checkoutStepOneReady }) => {
      await checkoutStepOneReady.assertLoaded();
    });

    test('should navigate to checkout step two when valid checkout data is submitted @positive', async ({
      checkoutStepTwoPage,
      checkoutStepOnePage,
    }) => {
      await assertFormFieldsVisible([
        checkoutStepOnePage.firstNameInput,
        checkoutStepOnePage.lastNameInput,
        checkoutStepOnePage.postalCodeInput,
      ]);

      await checkoutStepOnePage.fillCheckoutForm(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.postalCode
      );

      await assertButtonState(checkoutStepOnePage.continueButton, {
        visible: true,
        enabled: true,
      });
      await checkoutStepOnePage.continueButton.click();
      await checkoutStepTwoPage.assertLoaded();
    });

    test('should display error message when first name is missing @negative', async ({
      checkoutStepOnePage,
    }) => {
      await assertFormFieldsVisible([
        checkoutStepOnePage.firstNameInput,
        checkoutStepOnePage.lastNameInput,
        checkoutStepOnePage.postalCodeInput,
      ]);

      await checkoutStepOnePage.fillCheckoutForm(
        '',
        checkoutData.lastName,
        checkoutData.postalCode
      );

      await assertButtonState(checkoutStepOnePage.continueButton, {
        visible: true,
        enabled: true,
      });
      await checkoutStepOnePage.continueButton.click();
      await expect(checkoutStepOnePage.errorMessage).toBeVisible();
      await expect(checkoutStepOnePage.errorMessage).toContainText(
        emptyFirstNameError
      );
    });

    test('should display error message when last name is missing @negative', async ({
      checkoutStepOnePage,
    }) => {
      await assertFormFieldsVisible([
        checkoutStepOnePage.firstNameInput,
        checkoutStepOnePage.lastNameInput,
        checkoutStepOnePage.postalCodeInput,
      ]);

      await checkoutStepOnePage.fillCheckoutForm(
        checkoutData.firstName,
        '',
        checkoutData.postalCode
      );

      await assertButtonState(checkoutStepOnePage.continueButton, {
        visible: true,
        enabled: true,
      });
      await checkoutStepOnePage.continueButton.click();
      await expect(checkoutStepOnePage.errorMessage).toBeVisible();
      await expect(checkoutStepOnePage.errorMessage).toContainText(
        emptyLastNameError
      );
    });

    test('should display error message when postal code is missing @negative', async ({
      checkoutStepOnePage,
    }) => {
      await assertFormFieldsVisible([
        checkoutStepOnePage.firstNameInput,
        checkoutStepOnePage.lastNameInput,
        checkoutStepOnePage.postalCodeInput,
      ]);

      await checkoutStepOnePage.fillCheckoutForm(
        checkoutData.firstName,
        checkoutData.lastName,
        ''
      );

      await assertButtonState(checkoutStepOnePage.continueButton, {
        visible: true,
        enabled: true,
      });
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
      await assertButtonState(checkoutStepOnePage.cancelButton, {
        visible: true,
        enabled: true,
      });
      await checkoutStepOnePage.cancelButton.click();
      await cartPage.assertLoaded();
    });
  });

  test.describe('Checkout Step Two Page @checkout', () => {
    test.beforeEach(async ({ checkoutStepTwoReady }) => {
      await checkoutStepTwoReady.assertLoaded();
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
      await assertButtonState(checkoutStepTwoPage.cancelButton, {
        visible: true,
        enabled: true,
      });
      await checkoutStepTwoPage.cancelButton.click();
      await inventoryPage.assertLoaded();
      await inventoryPage.assertCartItemCount(1);
    });

    test('should navigate to checkout complete page when finish button is clicked @positive', async ({
      checkoutStepTwoPage,
      checkoutCompletePage,
    }) => {
      await assertButtonState(checkoutStepTwoPage.finishButton, {
        visible: true,
        enabled: true,
      });
      await checkoutStepTwoPage.finishButton.click();
      await checkoutCompletePage.assertLoaded();
    });
  });
});
