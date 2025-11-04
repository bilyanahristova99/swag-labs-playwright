import { Locator, Page, expect } from '@playwright/test';
import BasePage from '../BasePage';

export class CheckoutCompletePage extends BasePage {
  constructor(page: Page) {
    super(page, 'checkout-complete.html');
  }

  async assertLoaded(): Promise<void> {
    await expect(this.page.locator('.complete-header')).toBeVisible();
  }

  public get backHomeButton(): Locator {
    return this.page.getByRole('button', { name: 'Back Home' });
  }
}
