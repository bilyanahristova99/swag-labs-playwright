import { Page, Locator } from '@playwright/test';
import BasePage from '../BasePage';
import {
  assertProductDetails,
  STANDARD_PRODUCT_SELECTORS,
} from '../../utils/productAssertions';
import { assertElementsVisible } from '../../utils/assertions';

export class CheckoutStepTwoPage extends BasePage {
  constructor(page: Page) {
    super(page, 'checkout-step-two.html');
  }

  async assertLoaded(): Promise<void> {
    await assertElementsVisible([
      this.page.getByTestId('checkout-summary-container'),
    ]);
  }

  private get cartItem(): Locator {
    return this.page.getByTestId('inventory-item');
  }

  private get summaryTotal(): Locator {
    return this.page.getByTestId('total-label');
  }

  public get finishButton(): Locator {
    return this.page.getByTestId('finish');
  }

  public getCartItemByName(productName: string): Locator {
    return this.cartItem.filter({ hasText: productName });
  }

  public get cancelButton(): Locator {
    return this.page.getByTestId('cancel');
  }

  public async assertProductDetails(
    productName: string,
    expectedPrice: string,
    expectedDescription: string
  ): Promise<void> {
    const item = this.getCartItemByName(productName);
    await assertProductDetails(
      item,
      productName,
      expectedPrice,
      expectedDescription,
      STANDARD_PRODUCT_SELECTORS
    );
  }

  public async getTotalPrice(): Promise<string> {
    const totalText = await this.summaryTotal.textContent();
    const match = totalText?.match(/\$([0-9]+\.[0-9]{2})/);
    return match ? match[1] : '';
  }

  public async calculateExpectedTotal(
    productPrices: string[]
  ): Promise<string> {
    const sum = productPrices.reduce((acc, price) => {
      const numericPrice = parseFloat(price.replace('$', ''));
      return acc + numericPrice;
    }, 0);

    // Add tax (8% in Swag Labs)
    const subtotal = sum;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return total.toFixed(2);
  }
}
