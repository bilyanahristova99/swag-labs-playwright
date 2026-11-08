import { expect, Locator, Page } from '@playwright/test';
import InventoryBasePage from './InventoryBasePage';
import { assertCartBadgeCount } from '../../utils/cartAssertions';
import { assertProductImage } from '../../utils/productAssertions';
import { assertElementsVisible } from '../../utils/assertions';

export default class InventoryDetailsPage extends InventoryBasePage {
  constructor(page: Page) {
    super(page, 'inventory-item.html');
  }

  private get productDetails(): Locator {
    return this.page.locator('div.inventory_details');
  }

  private get productName(): Locator {
    return this.productDetails.getByTestId('inventory-item-name');
  }

  private get productPrice(): Locator {
    return this.productDetails.getByTestId('inventory-item-price');
  }

  private get productDescription(): Locator {
    return this.productDetails.getByTestId('inventory-item-desc');
  }

  private get productImage(): Locator {
    return this.productDetails.locator('[data-test$="-img"]');
  }

  public get addToCartButton(): Locator {
    return this.page.getByTestId('add-to-cart');
  }

  public get removeFromCartButton(): Locator {
    return this.page.getByTestId('remove');
  }

  public get backButton(): Locator {
    return this.page.getByTestId('back-to-products');
  }

  public async assertLoaded(): Promise<void> {
    await assertElementsVisible([
      this.productName,
      this.productPrice,
      this.productDescription,
      this.productImage,
    ]);
  }

  public async assertProductDetails(
    name: string,
    price: string,
    description: string
  ): Promise<void> {
    await expect(this.productName).toHaveText(name);
    await expect(this.productPrice).toHaveText(price);
    await expect(this.productDescription).toHaveText(description);
  }

  public async assertProductImage(): Promise<void> {
    await assertProductImage(this.productImage);
  }

  public async assertCartItemCount(expectedCount: number): Promise<void> {
    await assertCartBadgeCount(this.cartBadge, expectedCount);
  }
}
