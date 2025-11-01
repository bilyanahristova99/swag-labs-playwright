import { Page, expect, Locator } from '@playwright/test';
import BasePage from '../BasePage';
import { ButtonSelectors } from '../../constants/selectors/shared';
import { InventorySelectors } from '../../constants/selectors/shared';
import { CartSelectors } from '../../constants/selectors/shared';

export default class CartPage extends BasePage {
  constructor(page: Page) {
    super(page, 'cart.html');
  }

  private get cartList(): Locator {
    return this.page.locator('.cart_list');
  }

  private get cartFooter(): Locator {
    return this.page.locator('.cart_footer');
  }

  public get cartItem(): Locator {
    return this.page.locator(CartSelectors.CART_ITEM);
  }

  public get continueShoppingButton(): Locator {
    return this.cartFooter.locator(ButtonSelectors.BUTTON_SECONDARY);
  }

  public get checkoutButton(): Locator {
    return this.cartFooter.locator(ButtonSelectors.BUTTON_ACTION);
  }

  public async assertLoaded(): Promise<void> {
    await expect(this.cartList).toBeVisible();
  }

  public getCartItemByName(productName: string): Locator {
    return this.cartItem.filter({ hasText: productName });
  }

  public async assertProductDetails(
    productName: string,
    expectedPrice: string,
    expectedDescription: string,
    expectedQuantity: number = 1
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
    await expect(item.locator('.cart_quantity')).toHaveText(
      expectedQuantity.toString()
    );
  }

  public async removeProduct(productName: string): Promise<void> {
    const item = this.getCartItemByName(productName);
    const removeButton = item
      .locator(ButtonSelectors.BUTTON_SECONDARY)
      .filter({ hasText: 'Remove' });
    await removeButton.click();
  }
}
