import { Locator, Page } from '@playwright/test';
import BasePage from '../BasePage';
import { assertElementsVisible } from '../../utils/assertions';

export class CheckoutCompletePage extends BasePage {
  constructor(page: Page) {
    super(page, 'checkout-complete.html');
  }

  async assertLoaded(): Promise<void> {
    await assertElementsVisible([this.page.getByTestId('complete-header')]);
  }

  public get backHomeButton(): Locator {
    return this.page.getByTestId('back-to-products');
  }
}
