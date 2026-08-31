import { Locator, expect } from '@playwright/test';

/**
 * Asserts that multiple form fields are visible.
 * Commonly used before filling out forms to ensure fields are rendered.
 *
 * @param fields - Array of Playwright locators for form fields
 * @example
 * await assertFormFieldsVisible([
 *   page.locator('#first-name'),
 *   page.locator('#last-name'),
 *   page.locator('#postal-code')
 * ]);
 */
export async function assertFormFieldsVisible(
  fields: Locator[]
): Promise<void> {
  for (const field of fields) {
    await expect(field).toBeVisible();
  }
}

/**
 * Asserts that a form field displays an error message.
 * Used for validation error checking in forms.
 *
 * @param errorLocator - Playwright locator for the error message element
 * @param expectedErrorMessage - Expected error message text (can be partial)
 * @example
 * await assertFormFieldError(
 *   page.locator('[data-test="error"]'),
 *   'First Name is required'
 * );
 */
export async function assertFormFieldError(
  errorLocator: Locator,
  expectedErrorMessage: string
): Promise<void> {
  await expect(errorLocator).toBeVisible();
  await expect(errorLocator).toContainText(expectedErrorMessage);
}
