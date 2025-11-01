import { test, expect } from '../src/fixtures/test.fixture';
import { SAUCE_LABS_BACKPACK } from '../src/constants/products';

test.describe('Product Detail Page @detail', () => {
  test.beforeEach(async ({ loggedIn, inventoryPage, inventoryDetailsPage }) => {
    await loggedIn();
    await inventoryPage.assertLoaded();
    await inventoryPage.goToProductDetail(SAUCE_LABS_BACKPACK.name);
    await inventoryDetailsPage.assertLoaded();
  });

  test('product detail page shows correct information @positive', async ({ inventoryDetailsPage }) => {
    await inventoryDetailsPage.assertProductDetails(
      SAUCE_LABS_BACKPACK.name,
      SAUCE_LABS_BACKPACK.price,
      SAUCE_LABS_BACKPACK.description
    );

    await inventoryDetailsPage.assertProductImage();
  });

  test('add product to cart from detail page @positive', async ({ inventoryDetailsPage }) => {
    await inventoryDetailsPage.assertCartItemCount(0);
    await expect(inventoryDetailsPage.addToCartButton).toBeVisible();
    await inventoryDetailsPage.addToCartButton.click();
    await inventoryDetailsPage.assertCartItemCount(1);
  });

  test('remove product from cart on detail page @positive', async ({ inventoryDetailsPage }) => {
    await expect(inventoryDetailsPage.addToCartButton).toBeVisible();
    await inventoryDetailsPage.addToCartButton.click();
    await inventoryDetailsPage.assertCartItemCount(1);
    await expect(inventoryDetailsPage.removeFromCartButton).toBeVisible();
    await inventoryDetailsPage.removeFromCartButton.click();
    await expect(inventoryDetailsPage.addToCartButton).toBeVisible();
    await inventoryDetailsPage.assertCartItemCount(0);
  });

  test('navigate back to inventory from detail page @positive', async ({ inventoryPage, inventoryDetailsPage }) => {
    await expect(inventoryDetailsPage.backButton).toBeVisible();
    await inventoryDetailsPage.backButton.click();
    await inventoryPage.assertLoaded();
  });

  test('navigate to cart from detail page @positive', async ({ cartPage, inventoryDetailsPage }) => {
    await expect(inventoryDetailsPage.addToCartButton).toBeVisible();
    await inventoryDetailsPage.addToCartButton.click();
    await expect(inventoryDetailsPage.cartLink).toBeVisible();
    await inventoryDetailsPage.cartLink.click();
    await cartPage.assertLoaded();
  });
});
