import { Locator, expect } from '@playwright/test';

/**
 * Asserts cart badge count matches expected value.
 * When count is 0, badge should be hidden. When count > 0, badge should be visible and display the count.
 *
 * @param badgeLocator - Playwright locator for the cart badge element
 * @param expectedCount - Expected number of items in cart
 * @example
 * await assertCartBadgeCount(page.locator('.shopping_cart_badge'), 3);
 * await assertCartBadgeCount(page.locator('.shopping_cart_badge'), 0); // Badge should be hidden
 */
export async function assertCartBadgeCount(
  badgeLocator: Locator,
  expectedCount: number
): Promise<void> {
  if (expectedCount === 0) {
    // When cart is empty, the badge element is not rendered and is hidden
    await expect(badgeLocator).toBeHidden();
  } else {
    await expect(badgeLocator).toBeVisible();
    await expect(badgeLocator).toHaveText(expectedCount.toString());
  }
}
