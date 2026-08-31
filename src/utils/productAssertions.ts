import { Locator, expect } from '@playwright/test';
import { InventorySelectors } from '../constants/selectors/shared';

/**
 * Selectors for product details within a container/item locator.
 * Used to locate name, price, description, and optionally quantity within a product item.
 */
export interface ProductSelectors {
  name: string;
  price: string;
  description: string;
  quantity?: string; // Optional selector for quantity (used in cart)
}

/**
 * Standard product selectors used across inventory and cart pages.
 * Uses the shared InventorySelectors constants.
 */
export const STANDARD_PRODUCT_SELECTORS: ProductSelectors = {
  name: InventorySelectors.INVENTORY_ITEM_NAME,
  price: InventorySelectors.INVENTORY_ITEM_PRICE,
  description: InventorySelectors.INVENTORY_ITEM_DESCRIPTION,
};

/**
 * Product selectors for cart items (includes quantity).
 */
export const CART_PRODUCT_SELECTORS: ProductSelectors = {
  ...STANDARD_PRODUCT_SELECTORS,
  quantity: '[data-test="item-quantity"]',
};

/**
 * Asserts product details (name, price, description) within a product item container.
 * This is a reusable utility that works with different page structures.
 *
 * @param itemLocator - Locator for the product item container
 * @param expectedName - Expected product name
 * @param expectedPrice - Expected product price (e.g., '$29.99')
 * @param expectedDescription - Expected product description
 * @param selectors - Selectors for finding name, price, description within the item
 * @param assertItemVisible - Whether to assert item container is visible (default: true)
 * @example
 * const item = page.locator('.cart_item').filter({ hasText: 'Backpack' });
 * await assertProductDetails(
 *   item,
 *   'Sauce Labs Backpack',
 *   '$29.99',
 *   'carry.allTheThings()...',
 *   CART_PRODUCT_SELECTORS
 * );
 */
export async function assertProductDetails(
  itemLocator: Locator,
  expectedName: string,
  expectedPrice: string,
  expectedDescription: string,
  selectors: ProductSelectors = STANDARD_PRODUCT_SELECTORS,
  assertItemVisible: boolean = true
): Promise<void> {
  if (assertItemVisible) {
    await expect(itemLocator).toBeVisible();
  }

  await expect(itemLocator.locator(selectors.name)).toHaveText(expectedName);
  await expect(itemLocator.locator(selectors.price)).toHaveText(expectedPrice);
  await expect(itemLocator.locator(selectors.description)).toHaveText(
    expectedDescription
  );
}

/**
 * Asserts product details including quantity (used in cart).
 *
 * @param itemLocator - Locator for the product item container
 * @param expectedName - Expected product name
 * @param expectedPrice - Expected product price
 * @param expectedDescription - Expected product description
 * @param expectedQuantity - Expected quantity in cart
 * @param selectors - Selectors for finding details within the item (must include quantity)
 * @example
 * await assertProductDetailsWithQuantity(
 *   cartItem,
 *   'Sauce Labs Backpack',
 *   '$29.99',
 *   'Description...',
 *   2,
 *   CART_PRODUCT_SELECTORS
 * );
 */
export async function assertProductDetailsWithQuantity(
  itemLocator: Locator,
  expectedName: string,
  expectedPrice: string,
  expectedDescription: string,
  expectedQuantity: number,
  selectors: ProductSelectors = CART_PRODUCT_SELECTORS
): Promise<void> {
  await assertProductDetails(
    itemLocator,
    expectedName,
    expectedPrice,
    expectedDescription,
    selectors
  );

  if (!selectors.quantity) {
    throw new Error(
      'Quantity selector is required for assertProductDetailsWithQuantity'
    );
  }

  await expect(itemLocator.locator(selectors.quantity)).toHaveText(
    expectedQuantity.toString()
  );
}

/**
 * Asserts product image is visible and has a valid src attribute.
 * Used for both inventory list items and detail pages.
 *
 * @param imageLocator - Locator for the product image element
 * @example
 * // For inventory list item
 * const imageLocator = item.locator('.inventory_item_img').getByRole('img');
 * await assertProductImage(imageLocator);
 *
 * // For detail page
 * await assertProductImage(page.locator('.inventory_details_img'));
 */
export async function assertProductImage(imageLocator: Locator): Promise<void> {
  await expect(imageLocator).toBeVisible();
  await expect(imageLocator).toHaveAttribute('src');
}
