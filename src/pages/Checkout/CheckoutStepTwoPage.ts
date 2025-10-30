import { Page, expect, Locator } from '@playwright/test';
import BasePage from '../BasePage';
import { CartSelectors } from '../../constants/selectors/shared';
import { InventorySelectors } from '../../constants/selectors/shared';

export class CheckoutStepTwoPage extends BasePage {
  constructor(page: Page) {
    super(page, 'checkout-step-two.html');
  }

  async assertLoaded(): Promise<void> {
    await expect(this.page.locator('.summary_info')).toBeVisible();
  }

  private get cartItem(): Locator {
    return this.page.locator(CartSelectors.CART_ITEM);
  }

  private get summarySubtotal(): Locator {
    return this.page.locator('.summary_subtotal_label');
  }

  private get summaryTax(): Locator {
    return this.page.locator('.summary_tax_label');
  }

  private get summaryTotal(): Locator {
    return this.page.locator('.summary_total_label');
  }

  public getCartItemByName(productName: string): Locator {
    return this.cartItem.filter({ hasText: productName });
  }

  public async assertProductDetails(
    productName: string,
    expectedPrice: string,
    expectedDescription: string
  ): Promise<void> {
    const item = this.getCartItemByName(productName);
    await expect(item).toBeVisible();

    await expect(
      item.locator(InventorySelectors.INVENTORY_ITEM_NAME)
    ).toHaveText(productName);
    await expect(
      item.locator(InventorySelectors.INVENTORY_ITEM_PRICE)
    ).toHaveText(expectedPrice);
    await expect(
      item.locator(InventorySelectors.INVENTORY_ITEM_DESCRIPTION)
    ).toHaveText(expectedDescription);
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
