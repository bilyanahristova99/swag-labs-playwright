import { test, expect } from '../src/fixtures/test.fixture';
import {
  SAUCE_LABS_BACKPACK,
  SAUCE_LABS_BIKE_LIGHT,
} from '../src/constants/products';
import {
  assertElementVisible,
  assertElementHidden,
} from '../src/utils/assertions';

test.describe('Cart Page @cart', () => {
  test.beforeEach(async ({ loggedInInventoryPage, cartPage }) => {
    await loggedInInventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
    await loggedInInventoryPage.addProductToCart(SAUCE_LABS_BIKE_LIGHT.name);
    await loggedInInventoryPage.assertCartItemCount(2);
    await loggedInInventoryPage.cartLink.click();
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

  test('should preserve the exact cart contents after a reload @positive', async ({
    page,
    cartPage,
  }) => {
    await page.reload();
    await cartPage.assertLoaded();

    const products = [SAUCE_LABS_BACKPACK, SAUCE_LABS_BIKE_LIGHT];
    await expect(cartPage.cartItem).toHaveCount(products.length);
    for (const { name, price, description } of products) {
      await cartPage.assertProductDetails(name, price, description);
    }
    await expect(cartPage.cartBadge).toHaveText('2');
  });

  test('should remove individual product from cart when remove button is clicked @positive', async ({
    cartPage,
  }) => {
    await cartPage.removeProduct(SAUCE_LABS_BIKE_LIGHT.name);
    await expect(cartPage.cartItem).toHaveCount(1);
    await assertElementHidden(
      cartPage.getCartItemByName(SAUCE_LABS_BIKE_LIGHT.name)
    );
    await assertElementVisible(
      cartPage.getCartItemByName(SAUCE_LABS_BACKPACK.name)
    );
  });

  test('should navigate to inventory page when continue shopping button is clicked @positive', async ({
    cartPage,
    inventoryPage,
  }) => {
    await assertElementVisible(cartPage.continueShoppingButton);
    await cartPage.continueShoppingButton.click();
    await inventoryPage.assertLoaded();
  });

  test('should remove all products from cart when all remove buttons are clicked @positive', async ({
    cartPage,
  }) => {
    await cartPage.removeProduct(SAUCE_LABS_BACKPACK.name);
    await cartPage.removeProduct(SAUCE_LABS_BIKE_LIGHT.name);
    await expect(cartPage.cartItem).toHaveCount(0);
    await assertElementHidden(
      cartPage.getCartItemByName(SAUCE_LABS_BACKPACK.name)
    );
    await assertElementHidden(
      cartPage.getCartItemByName(SAUCE_LABS_BIKE_LIGHT.name)
    );
  });

  test('should keep checkout available when cart is empty @positive', async ({
    cartPage,
  }) => {
    await cartPage.removeProduct(SAUCE_LABS_BACKPACK.name);
    await cartPage.removeProduct(SAUCE_LABS_BIKE_LIGHT.name);
    await expect(cartPage.cartItem).toHaveCount(0);
    await assertElementHidden(
      cartPage.getCartItemByName(SAUCE_LABS_BACKPACK.name)
    );
    await assertElementHidden(
      cartPage.getCartItemByName(SAUCE_LABS_BIKE_LIGHT.name)
    );
    await expect(cartPage.checkoutButton).toBeEnabled();
  });
});
