import { Page, Locator } from '@playwright/test';
import BasePage from '../BasePage';
import {
  assertProductDetailsWithQuantity,
  CART_PRODUCT_SELECTORS,
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

  public get cartItem(): Locator {
    return this.page.getByTestId('inventory-item');
  }

  public get summarySubtotal(): Locator {
    return this.page.getByTestId('subtotal-label');
  }

  public get summaryTax(): Locator {
    return this.page.getByTestId('tax-label');
  }

  public get summaryTotal(): Locator {
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
    expectedDescription: string,
    expectedQuantity = 1
  ): Promise<void> {
    const item = this.getCartItemByName(productName);
    await assertProductDetailsWithQuantity(
      item,
      productName,
      expectedPrice,
      expectedDescription,
      expectedQuantity,
      CART_PRODUCT_SELECTORS
    );
  }
}
