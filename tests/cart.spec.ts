import { test, expect } from '@playwright/test';
import LoginPage from '../src/pages/LoginPage';
import InventoryPage from '../src/pages/Inventory/InventoryPage';
import CartPage from '../src/pages/CartPage';
import { STANDARD_USER } from '../src/constants/users';
import {
  SAUCE_LABS_BACKPACK,
  SAUCE_LABS_BIKE_LIGHT,
} from '../src/constants/products';

test.describe('Cart Page @cart', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    // Login first
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await loginPage.verifyAuthenticationSuccess();
    await inventoryPage.assertLoaded();

    // Add 2 products to cart in setup
    await inventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
    await inventoryPage.addProductToCart(SAUCE_LABS_BIKE_LIGHT.name);
    await inventoryPage.assertCartItemCount(2);

    // Navigate to cart page
    await cartPage.goto();
    await cartPage.assertLoaded();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('validate product details for both products @positive', async () => {
    await cartPage.assertProductDetails(
      SAUCE_LABS_BACKPACK.name,
      SAUCE_LABS_BACKPACK.price,
      SAUCE_LABS_BACKPACK.description,
      1
    );

    await cartPage.assertProductDetails(
      SAUCE_LABS_BIKE_LIGHT.name,
      SAUCE_LABS_BIKE_LIGHT.price,
      SAUCE_LABS_BIKE_LIGHT.description,
      1
    );
  });

  test('remove one of the two products @positive', async () => {
    await cartPage.removeProduct(SAUCE_LABS_BIKE_LIGHT.name);
    await expect(cartPage.cartItem).toHaveCount(1);
    await expect(
      cartPage.getCartItemByName(SAUCE_LABS_BIKE_LIGHT.name)
    ).not.toBeVisible();
    await expect(
      cartPage.getCartItemByName(SAUCE_LABS_BACKPACK.name)
    ).toBeVisible();
  });

  test('click continue shopping button @positive', async () => {
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await cartPage.continueShoppingButton.click();
    await inventoryPage.assertLoaded();
  });

  test('remove all products from cart @positive', async () => {
    await cartPage.removeProduct(SAUCE_LABS_BACKPACK.name);
    await cartPage.removeProduct(SAUCE_LABS_BIKE_LIGHT.name);
    await expect(cartPage.cartItem).toHaveCount(0);
    await expect(
      cartPage.getCartItemByName(SAUCE_LABS_BACKPACK.name)
    ).not.toBeVisible();
    await expect(
      cartPage.getCartItemByName(SAUCE_LABS_BIKE_LIGHT.name)
    ).not.toBeVisible();
  });

  test('checkout button should be disabled if cart is empty @negative', async () => {
    await cartPage.removeProduct(SAUCE_LABS_BACKPACK.name);
    await cartPage.removeProduct(SAUCE_LABS_BIKE_LIGHT.name);
    await expect(cartPage.cartItem).toHaveCount(0);
    await expect(
      cartPage.getCartItemByName(SAUCE_LABS_BACKPACK.name)
    ).not.toBeVisible();
    await expect(
      cartPage.getCartItemByName(SAUCE_LABS_BIKE_LIGHT.name)
    ).not.toBeVisible();
    await expect(cartPage.checkoutButton).toBeDisabled();
  });
});
