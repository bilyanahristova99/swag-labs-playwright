import { Page, expect } from '@playwright/test';
import BasePage from '../BasePage';

export class CheckoutStepTwoPage extends BasePage {
  constructor(page: Page) {
    super(page, 'checkout-step-two.html');
  }
  async assertLoaded(): Promise<void> {
    await expect(this.page.locator('.summary_info')).toBeVisible();
  }
}
