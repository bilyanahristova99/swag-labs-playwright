import { test, expect } from '../src/fixtures/test.fixture';
import { SAUCE_LABS_BACKPACK } from '../src/constants/products';
import { assertElementVisible } from '../src/utils/assertions';

test.describe('Product Detail Page @detail', () => {
  test.beforeEach(async ({ loggedInInventoryPage, inventoryDetailsPage }) => {
    await loggedInInventoryPage.goToProductDetail(SAUCE_LABS_BACKPACK.name);
    await inventoryDetailsPage.assertLoaded();
  });

  test('should display correct product information including name, price, description and image @positive', async ({
    inventoryDetailsPage,
  }) => {
    await inventoryDetailsPage.assertProductDetails(
      SAUCE_LABS_BACKPACK.name,
      SAUCE_LABS_BACKPACK.price,
      SAUCE_LABS_BACKPACK.description
    );

    await inventoryDetailsPage.assertProductImage();
  });

  test('should add product to cart from detail page and update cart badge @positive', async ({
    inventoryDetailsPage,
  }) => {
    await inventoryDetailsPage.assertCartItemCount(0);
    await assertElementVisible(inventoryDetailsPage.addToCartButton);
    await inventoryDetailsPage.addToCartButton.click();
    await inventoryDetailsPage.assertCartItemCount(1);
  });

  test('should remove product from cart on detail page and update cart badge @positive', async ({
    inventoryDetailsPage,
  }) => {
    await assertElementVisible(inventoryDetailsPage.addToCartButton);
    await inventoryDetailsPage.addToCartButton.click();
    await inventoryDetailsPage.assertCartItemCount(1);
    await assertElementVisible(inventoryDetailsPage.removeFromCartButton);
    await inventoryDetailsPage.removeFromCartButton.click();
    await assertElementVisible(inventoryDetailsPage.addToCartButton);
    await inventoryDetailsPage.assertCartItemCount(0);
  });

  test('should navigate back to inventory page when back button is clicked @positive', async ({
    inventoryPage,
    inventoryDetailsPage,
  }) => {
    await assertElementVisible(inventoryDetailsPage.backButton);
    await inventoryDetailsPage.backButton.click();
    await inventoryPage.assertLoaded();
  });

  test('should show the exact product added from the detail page in the cart @positive', async ({
    cartPage,
    inventoryDetailsPage,
  }) => {
    await assertElementVisible(inventoryDetailsPage.addToCartButton);
    await inventoryDetailsPage.addToCartButton.click();
    await assertElementVisible(inventoryDetailsPage.cartLink);
    await inventoryDetailsPage.cartLink.click();
    await cartPage.assertLoaded();
    await expect(cartPage.cartItem).toHaveCount(1);
    const { name, price, description } = SAUCE_LABS_BACKPACK;
    await cartPage.assertProductDetails(name, price, description);
  });
});
