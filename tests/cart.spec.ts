import { test, expect } from '../src/fixtures/test.fixture';
import {
  SAUCE_LABS_BACKPACK,
  SAUCE_LABS_BIKE_LIGHT,
} from '../src/constants/products';

test.describe('Cart Page @cart', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    // loggedIn runs automatically via fixtures
    await inventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
    await inventoryPage.addProductToCart(SAUCE_LABS_BIKE_LIGHT.name);
    await inventoryPage.assertCartItemCount(2);
    await cartPage.goto();
    await cartPage.assertLoaded();
  });

  test('validate product details for both products @positive', async ({ cartPage }) => {
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

  test('remove one of the two products @positive', async ({ cartPage }) => {
    await cartPage.removeProduct(SAUCE_LABS_BIKE_LIGHT.name);
    await expect(cartPage.cartItem).toHaveCount(1);
    await expect(
      cartPage.getCartItemByName(SAUCE_LABS_BIKE_LIGHT.name)
    ).not.toBeVisible();
    await expect(
      cartPage.getCartItemByName(SAUCE_LABS_BACKPACK.name)
    ).toBeVisible();
  });

  test('click continue shopping button @positive', async ({ cartPage, inventoryPage }) => {
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await cartPage.continueShoppingButton.click();
    await inventoryPage.assertLoaded();
  });

  test('remove all products from cart @positive', async ({ cartPage }) => {
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

  test('checkout button should be disabled if cart is empty @negative', async ({ cartPage }) => {
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
