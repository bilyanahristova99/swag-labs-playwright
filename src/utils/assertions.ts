import { Locator, expect } from '@playwright/test';

/**
 * Asserts that multiple elements are visible.
 * Useful for checking form fields, page sections, or multiple UI elements at once.
 *
 * @param locators - Array of Playwright locators to check for visibility
 * @example
 * await assertElementsVisible([
 *   page.locator('#username'),
 *   page.locator('#password'),
 *   page.locator('#login-button')
 * ]);
 */
export async function assertElementsVisible(
  locators: Locator[]
): Promise<void> {
  for (const locator of locators) {
    await expect(locator).toBeVisible();
  }
}

/**
 * Asserts that a single element is visible.
 * Optional timeout and error message customization.
 *
 * @param locator - Playwright locator to check for visibility
 * @param options - Optional configuration
 * @param options.timeout - Custom timeout in milliseconds
 * @example
 * await assertElementVisible(page.locator('#submit-btn'), { timeout: 5000 });
 */
export async function assertElementVisible(
  locator: Locator,
  options?: { timeout?: number }
): Promise<void> {
  if (options?.timeout) {
    await expect(locator).toBeVisible({ timeout: options.timeout });
  } else {
    await expect(locator).toBeVisible();
  }
}

/**
 * Asserts that an element is hidden (not visible).
 *
 * @param locator - Playwright locator to check for hidden state
 * @example
 * await assertElementHidden(page.locator('.loading-spinner'));
 */
export async function assertElementHidden(locator: Locator): Promise<void> {
  await expect(locator).toBeHidden();
}

/**
 * Asserts button state (visibility and enabled/disabled status).
 * Commonly used for form buttons, navigation buttons, etc.
 *
 * @param buttonLocator - Playwright locator for the button
 * @param options - State options
 * @param options.visible - Whether the button should be visible (default: true)
 * @param options.enabled - Whether the button should be enabled (optional)
 * @example
 * // Check button is visible and enabled
 * await assertButtonState(page.locator('#continue-btn'), { visible: true, enabled: true });
 *
 * // Check button is visible but disabled
 * await assertButtonState(page.locator('#submit-btn'), { visible: true, enabled: false });
 */
export async function assertButtonState(
  buttonLocator: Locator,
  options: { visible: boolean; enabled?: boolean }
): Promise<void> {
  if (options.visible) {
    await expect(buttonLocator).toBeVisible();
  } else {
    await expect(buttonLocator).toBeHidden();
    return; // If not visible, we don't check enabled state
  }

  if (options.enabled !== undefined) {
    if (options.enabled) {
      await expect(buttonLocator).toBeEnabled();
    } else {
      await expect(buttonLocator).toBeDisabled();
    }
  }
}
