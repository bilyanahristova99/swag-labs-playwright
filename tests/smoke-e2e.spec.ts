import { test, expect } from '../src/fixtures/test.fixture';
import checkoutData from '../src/constants/checkoutData';
import {
  SAUCE_LABS_BACKPACK,
  SAUCE_LABS_BIKE_LIGHT,
} from '../src/constants/products';
import { STANDARD_USER } from '../src/constants/users';
import { calculateExpectedOrderTotals } from '../src/utils/orderTotals';

test.describe('Smoke E2E Flows @smoke', () => {
  test('should complete an order for exactly two selected products and clear the cart @positive', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage: overview,
    checkoutCompletePage: confirmation,
  }) => {
    const products = [SAUCE_LABS_BACKPACK, SAUCE_LABS_BIKE_LIGHT];

    await test.step('Sign in as the standard user', async () => {
      await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
      await inventoryPage.assertLoaded();
    });

    await test.step('Add the selected products and start checkout', async () => {
      for (const { name } of products) {
        await inventoryPage.addProductToCart(name);
      }
      await inventoryPage.assertCartItemCount(products.length);
      await inventoryPage.cartLink.click();
      await cartPage.assertLoaded();
      await cartPage.checkoutButton.click();
      await checkoutStepOnePage.assertLoaded();
    });

    await test.step('Verify the order before submitting it', async () => {
      await checkoutStepOnePage.submitCheckoutForm(checkoutData);
      await overview.assertLoaded();

      await expect(overview.cartItem).toHaveCount(products.length);
      for (const { name, price, description } of products) {
        await overview.assertProductDetails(name, price, description);
      }
      const expected = calculateExpectedOrderTotals(products);
      await expect(overview.summarySubtotal).toHaveText(
        `Item total: ${expected.subtotal}`
      );
      await expect(overview.summaryTax).toHaveText(`Tax: ${expected.tax}`);
      await expect(overview.summaryTotal).toHaveText(
        `Total: ${expected.total}`
      );
    });

    await test.step('Finish the order and verify the cart is empty', async () => {
      await overview.finishButton.click();
      await expect(confirmation.confirmationHeading).toHaveText(
        'Thank you for your order!'
      );
      await confirmation.backHomeButton.click();
      await inventoryPage.assertLoaded();
      await inventoryPage.cartLink.click();
      await cartPage.assertLoaded();
      await expect(cartPage.cartItem).toHaveCount(0);
    });
  });
});
