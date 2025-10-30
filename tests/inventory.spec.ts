import { test, expect } from '../src/fixtures/test.fixture';
import { FILTER_OPTIONS } from '../src/constants/enums';
import {
  SAUCE_LABS_BACKPACK,
  SAUCE_LABS_BIKE_LIGHT,
  SAUCE_LABS_BOLT_T_SHIRT,
} from '../src/constants/products';

test.describe('Inventory Page @inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    // loggedIn is auto-applied via fixtures; ensure page loaded
    await inventoryPage.assertLoaded();
  });

  test('one product has name, price, description and loaded image @positive', async ({ inventoryPage }) => {
    await inventoryPage.assertProductElements(
      SAUCE_LABS_BACKPACK.name,
      SAUCE_LABS_BACKPACK.price,
      SAUCE_LABS_BACKPACK.description
    );
    await inventoryPage.assertProductImage(SAUCE_LABS_BACKPACK.name);
  });

  test('add button is shown before adding product and remove after @positive', async ({ inventoryPage }) => {
    const productName = SAUCE_LABS_BACKPACK.name;
    await inventoryPage.assertAddButtonVisible(productName);
    await inventoryPage.addProductToCart(productName);
    await inventoryPage.assertRemoveButtonVisible(productName);
  });

  test('add single product to cart @positive', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartLink).toBeVisible();
    await inventoryPage.assertCartItemCount(0);
    await inventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
    await inventoryPage.assertCartItemCount(1);
  });

  test('add multiple products to cart @positive', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartLink).toBeVisible();
    await inventoryPage.assertCartItemCount(0);
    await inventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
    await inventoryPage.addProductToCart(SAUCE_LABS_BIKE_LIGHT.name);
    await inventoryPage.addProductToCart(SAUCE_LABS_BOLT_T_SHIRT.name);

    await inventoryPage.assertCartItemCount(3);
  });

  test('remove product from cart @positive', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartLink).toBeVisible();
    await inventoryPage.assertCartItemCount(0);
    await inventoryPage.addProductToCart(SAUCE_LABS_BACKPACK.name);
    await inventoryPage.addProductToCart(SAUCE_LABS_BIKE_LIGHT.name);
    await inventoryPage.assertCartItemCount(2);

    await inventoryPage.removeProductFromCart(SAUCE_LABS_BACKPACK.name);
    await inventoryPage.assertCartItemCount(1);
  });

  test.describe('Sorting @sort', () => {
    test('user can sort the products by name (a to z) @positive', async ({ inventoryPage }) => {
      await expect(inventoryPage.sortDropdown).toBeVisible();
      await inventoryPage.sortBy(FILTER_OPTIONS.NAME_A_TO_Z);
      await inventoryPage.assertProductsSortedByName(
        FILTER_OPTIONS.NAME_A_TO_Z
      );
    });

    test('user can sort the products by name (z to a) @positive', async ({ inventoryPage }) => {
      await expect(inventoryPage.sortDropdown).toBeVisible();
      await inventoryPage.sortBy(FILTER_OPTIONS.NAME_Z_TO_A);
      await inventoryPage.assertProductsSortedByName(
        FILTER_OPTIONS.NAME_Z_TO_A
      );
    });

    test('user can sort the products by price (low to high) @positive', async ({ inventoryPage }) => {
      await expect(inventoryPage.sortDropdown).toBeVisible();
      await inventoryPage.sortBy(FILTER_OPTIONS.PRICE_LOW_TO_HIGH);
      await inventoryPage.assertProductsSortedByPrice(
        FILTER_OPTIONS.PRICE_LOW_TO_HIGH
      );
    });

    test('user can sort the products by price (high to low) @positive', async ({ inventoryPage }) => {
      await expect(inventoryPage.sortDropdown).toBeVisible();
      await inventoryPage.sortBy(FILTER_OPTIONS.PRICE_HIGH_TO_LOW);
      await inventoryPage.assertProductsSortedByPrice(
        FILTER_OPTIONS.PRICE_HIGH_TO_LOW
      );
    });
  });
});
