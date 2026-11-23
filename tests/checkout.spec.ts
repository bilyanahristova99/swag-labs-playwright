import { test, expect } from '../src/fixtures/test.fixture';
import { openCheckoutWithProducts } from '../src/flows/openCheckoutWithProducts';
import checkoutData from '../src/constants/checkoutData';
import { SAUCE_LABS_BACKPACK } from '../src/constants/products';
import type { CheckoutData } from '../src/types/testData';
import { assertFormFieldsVisible } from '../src/utils/formAssertions';
import { assertButtonState } from '../src/utils/assertions';
import { calculateExpectedOrderTotals } from '../src/utils/orderTotals';

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
    test.beforeEach(
      async ({ loggedInInventoryPage, cartPage, checkoutStepOnePage }) => {
        await loggedInInventoryPage.assertCartItemCount(0);
        await openCheckoutWithProducts(
          { inventoryPage: loggedInInventoryPage, cartPage },
          [SAUCE_LABS_BACKPACK]
        );
        await checkoutStepOnePage.assertLoaded();
      }
    );

    test('should navigate to checkout step two when valid checkout data is submitted @positive', async ({
      checkoutStepOnePage,
      checkoutStepTwoPage,
    }) => {
      await assertFormFieldsVisible([
        checkoutStepOnePage.firstNameInput,
        checkoutStepOnePage.lastNameInput,
        checkoutStepOnePage.postalCodeInput,
      ]);

      await checkoutStepOnePage.submitCheckoutForm(checkoutData);
      await checkoutStepTwoPage.assertLoaded();
    });

    for (const { name, customer, expectedError } of validationCases) {
      test(`should display an error when ${name} @negative`, async ({
        checkoutStepOnePage,
      }) => {
        await checkoutStepOnePage.submitCheckoutForm(customer);

        await expect(checkoutStepOnePage.errorMessage).toBeVisible();
        await expect(checkoutStepOnePage.errorMessage).toContainText(
          expectedError
        );
      });
    }

    test('should continue after correcting a missing postal code @positive', async ({
      checkoutStepOnePage,
      checkoutStepTwoPage,
    }) => {
      await checkoutStepOnePage.submitCheckoutForm({
        ...checkoutData,
        postalCode: '',
      });
      await expect(checkoutStepOnePage.errorMessage).toContainText(
        'Postal Code is required'
      );

      await checkoutStepOnePage.postalCodeInput.fill(checkoutData.postalCode);
      await checkoutStepOnePage.continueButton.click();
      await checkoutStepTwoPage.assertLoaded();
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
    test.beforeEach(
      async ({
        loggedInInventoryPage,
        cartPage,
        checkoutStepOnePage,
        checkoutStepTwoPage,
      }) => {
        await loggedInInventoryPage.assertCartItemCount(0);
        await openCheckoutWithProducts(
          { inventoryPage: loggedInInventoryPage, cartPage },
          [SAUCE_LABS_BACKPACK]
        );
        await checkoutStepOnePage.assertLoaded();
        await checkoutStepOnePage.submitCheckoutForm(checkoutData);
        await checkoutStepTwoPage.assertLoaded();
      }
    );

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
      const expected = calculateExpectedOrderTotals([SAUCE_LABS_BACKPACK]);

      await expect(checkoutStepTwoPage.summarySubtotal).toHaveText(
        `Item total: ${expected.subtotal}`
      );
      await expect(checkoutStepTwoPage.summaryTax).toHaveText(
        `Tax: ${expected.tax}`
      );
      await expect(checkoutStepTwoPage.summaryTotal).toHaveText(
        `Total: ${expected.total}`
      );
    });

    test('should retain the selected product when checkout is cancelled from overview @positive', async ({
      checkoutStepTwoPage,
      inventoryPage,
      cartPage,
    }) => {
      await assertButtonState(checkoutStepTwoPage.cancelButton, {
        visible: true,
        enabled: true,
      });
      await checkoutStepTwoPage.cancelButton.click();
      await inventoryPage.assertLoaded();
      await inventoryPage.assertCartItemCount(1);
      await inventoryPage.cartLink.click();
      await cartPage.assertLoaded();
      await expect(cartPage.cartItem).toHaveCount(1);
      const { name, price, description } = SAUCE_LABS_BACKPACK;
      await cartPage.assertProductDetails(name, price, description);
    });

    test('should navigate to checkout complete page when finish button is clicked @positive', async ({
      checkoutStepTwoPage,
      checkoutCompletePage,
    }) => {
      await checkoutStepTwoPage.finishButton.click();
      await checkoutCompletePage.assertLoaded();
    });
  });
});
