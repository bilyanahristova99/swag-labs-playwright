import { Page, expect, Locator } from '@playwright/test';
import BasePage from '../BasePage';
import { CartSelectors } from '../../constants/selectors/shared';

export default class InventoryDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page, 'inventory-item.html');
  }

  private get productName(): Locator {
    return this.page.locator('.inventory_details_name');
  }

  private get productPrice(): Locator {
    return this.page.locator('.inventory_details_price');
  }

  private get productDescription(): Locator {
    return this.page.locator('.inventory_details_desc');
  }

  private get productImage(): Locator {
    return this.page.getByRole('img');
  }

  public get addToCartButton(): Locator {
    return this.page.getByRole('button', { name: 'Add to cart' });
  }

  public get removeFromCartButton(): Locator {
    return this.page.getByRole('button', { name: 'Remove' });
  }

  public get backButton(): Locator {
    return this.page.getByRole('button', { name: 'Back' });
  }

  private get cartBadge(): Locator {
    return this.page.locator(CartSelectors.CART_BADGE);
  }

  public get cartLink(): Locator {
    return this.page.locator(CartSelectors.CART_LINK);
  }

  public async assertLoaded(): Promise<void> {
    await expect(this.productName).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productDescription).toBeVisible();
    await expect(this.productImage).toBeVisible();
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
    await expect(this.productImage).toBeVisible();
    await expect(this.productImage).toHaveAttribute('src');
  }

  public async assertCartItemCount(expectedCount: number): Promise<void> {
    if (expectedCount === 0) {
      await expect(this.cartBadge).toBeHidden();
    } else {
      await expect(this.cartBadge).toBeVisible();
      await expect(this.cartBadge).toHaveText(expectedCount.toString());
    }
  }
}
