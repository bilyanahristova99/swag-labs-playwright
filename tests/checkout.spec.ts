import { test, expect } from '../src/fixtures/test.fixture';
import checkoutData from '../src/constants/checkoutData';
import { SAUCE_LABS_BACKPACK } from '../src/constants/products';
import type { CheckoutData } from '../src/types/testData';
import { assertFormFieldsVisible } from '../src/utils/formAssertions';
import { assertButtonState } from '../src/utils/assertions';

const validationCases: Array<{
  name: string;
  customer: CheckoutData;
  expectedError: string;
}> = [
  {
    name: 'first name is missing',
    customer: { ...checkoutData, firstName: '' },
    expectedError: 'First Name is required',
  },
  {
    name: 'last name is missing',
    customer: { ...checkoutData, lastName: '' },
    expectedError: 'Last Name is required',
  },
  {
    name: 'postal code is missing',
    customer: { ...checkoutData, postalCode: '' },
    expectedError: 'Postal Code is required',
  },
];

test.describe('Checkout Process @checkout', () => {
  test.describe('Checkout Step One Page @checkout', () => {
    test.beforeEach(async ({ checkoutFlow }) => {
      await checkoutFlow.openStepOne(SAUCE_LABS_BACKPACK);
    });

    test('should navigate to checkout step two when valid checkout data is submitted @positive', async ({
      checkoutFlow,
      checkoutStepOnePage,
      checkoutStepTwoPage,
    }) => {
      await assertFormFieldsVisible([
        checkoutStepOnePage.firstNameInput,
        checkoutStepOnePage.lastNameInput,
        checkoutStepOnePage.postalCodeInput,
      ]);

      await checkoutFlow.openStepTwoFromCurrentStep(checkoutData);
      await checkoutStepTwoPage.assertLoaded();
    });

    for (const { name, customer, expectedError } of validationCases) {
      test(`should display an error when ${name} @negative`, async ({
        checkoutStepOnePage,
      }) => {
        await checkoutStepOnePage.fillCheckoutForm(
          customer.firstName,
          customer.lastName,
          customer.postalCode
        );
        await checkoutStepOnePage.continueButton.click();

        await expect(checkoutStepOnePage.errorMessage).toBeVisible();
        await expect(checkoutStepOnePage.errorMessage).toContainText(
          expectedError
        );
      });
    }

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
    test.beforeEach(async ({ checkoutFlow }) => {
      await checkoutFlow.openStepTwo(SAUCE_LABS_BACKPACK, checkoutData);
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
      const expectedTotal = await checkoutStepTwoPage.calculateExpectedTotal([
        SAUCE_LABS_BACKPACK.price,
      ]);
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
      checkoutFlow,
      checkoutCompletePage,
    }) => {
      await checkoutFlow.completeOrderFromOverview();
      await checkoutCompletePage.assertLoaded();
    });
  });
});
