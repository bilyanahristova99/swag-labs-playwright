import { test, expect } from '../src/fixtures/test.fixture';
import {
  SAUCE_LABS_BACKPACK,
  SAUCE_LABS_BIKE_LIGHT,
} from '../src/constants/products';

test.describe('Cart Page @cart', () => {
  test.beforeEach(async ({ loggedIn, inventoryPage, cartPage }) => {
    await loggedIn();
    await inventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
    await inventoryPage.addProductToCart(SAUCE_LABS_BIKE_LIGHT.name);
    await inventoryPage.assertCartItemCount(2);
    await inventoryPage.cartLink.click();
    await cartPage.assertLoaded();
  });

  test('should display correct product details for all products in cart @positive', async ({
    cartPage,
  }) => {
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

  test('should remove individual product from cart when remove button is clicked @positive', async ({
    cartPage,
  }) => {
    await cartPage.removeProduct(SAUCE_LABS_BIKE_LIGHT.name);
    await expect(cartPage.cartItem).toHaveCount(1);
    await expect(
      cartPage.getCartItemByName(SAUCE_LABS_BIKE_LIGHT.name)
    ).not.toBeVisible();
    await expect(
      cartPage.getCartItemByName(SAUCE_LABS_BACKPACK.name)
    ).toBeVisible();
  });

  test('should navigate to inventory page when continue shopping button is clicked @positive', async ({
    cartPage,
    inventoryPage,
  }) => {
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await cartPage.continueShoppingButton.click();
    await inventoryPage.assertLoaded();
  });

  test('should remove all products from cart when all remove buttons are clicked @positive', async ({
    cartPage,
  }) => {
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

  test('should disable checkout button when cart is empty @negative', async ({
    cartPage,
  }) => {
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
