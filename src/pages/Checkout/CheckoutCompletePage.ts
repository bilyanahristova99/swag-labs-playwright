import { Page, expect } from '@playwright/test';
import BasePage from '../BasePage';

export class CheckoutCompletePage extends BasePage {
  constructor(page: Page) {
    super(page, 'checkout-complete.html');
  }
  async assertLoaded(): Promise<void> {
    await expect(this.page.locator('.complete-header')).toBeVisible();
  }

  // TODO: Add locators for the checkout complete page - back home button (if such, but as far as I remember there is no such button), text with order confirmation
}
