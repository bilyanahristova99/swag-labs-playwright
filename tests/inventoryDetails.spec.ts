import { expect, test } from '@playwright/test';
import LoginPage from '../src/pages/LoginPage';
import InventoryPage from '../src/pages/Inventory/InventoryPage';
import InventoryDetailsPage from '../src/pages/Inventory/InventoryDetailsPage';
import CartPage from '../src/pages/CartPage';
import { STANDARD_USER } from '../src/constants/users';
import { SAUCE_LABS_BACKPACK } from '../src/constants/products';

test.describe('Product Detail Page @detail', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let productDetailPage: InventoryDetailsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    productDetailPage = new InventoryDetailsPage(page);
    cartPage = new CartPage(page);

    // Login first
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await loginPage.verifyAuthenticationSuccess();
    await inventoryPage.assertLoaded();

    await inventoryPage.goToProductDetail(SAUCE_LABS_BACKPACK.name);
    await productDetailPage.assertLoaded();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('product detail page shows correct information @positive', async () => {
    await productDetailPage.assertProductDetails(
      SAUCE_LABS_BACKPACK.name,
      SAUCE_LABS_BACKPACK.price,
      SAUCE_LABS_BACKPACK.description
    );

    await productDetailPage.assertProductImage();
  });

  test('add product to cart from detail page @positive', async () => {
    await productDetailPage.assertCartItemCount(0);
    await expect(productDetailPage.addToCartButton).toBeVisible();
    await productDetailPage.addToCartButton.click();
    await productDetailPage.assertCartItemCount(1);
  });

  test('remove product from cart on detail page @positive', async () => {
    await expect(productDetailPage.addToCartButton).toBeVisible();
    await productDetailPage.addToCartButton.click();
    await productDetailPage.assertCartItemCount(1);
    await expect(productDetailPage.removeFromCartButton).toBeVisible();
    await productDetailPage.removeFromCartButton.click();
    await expect(productDetailPage.addToCartButton).toBeVisible();
    await productDetailPage.assertCartItemCount(0);
  });

  test('navigate back to inventory from detail page @positive', async () => {
    await expect(productDetailPage.backButton).toBeVisible();
    await productDetailPage.backButton.click();
    await inventoryPage.assertLoaded();
  });

  test('navigate to cart from detail page @positive', async () => {
    await expect(productDetailPage.addToCartButton).toBeVisible();
    await productDetailPage.addToCartButton.click();
    await expect(productDetailPage.cartLink).toBeVisible();
    await productDetailPage.cartLink.click();
    await cartPage.assertLoaded();
  });
});
