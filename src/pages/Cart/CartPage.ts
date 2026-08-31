import { Page, Locator } from '@playwright/test';
import InventoryBasePage from '../Inventory/InventoryBasePage';
import {
  assertProductDetailsWithQuantity,
  CART_PRODUCT_SELECTORS,
} from '../../utils/productAssertions';
import { assertElementsVisible } from '../../utils/assertions';

export default class CartPage extends InventoryBasePage {
  constructor(page: Page) {
    super(page, 'cart.html');
  }

  private get cartList(): Locator {
    return this.page.getByTestId('cart-list');
  }

  public get cartItem(): Locator {
    return this.page.getByTestId('inventory-item');
  }

  public get continueShoppingButton(): Locator {
    return this.page.getByTestId('continue-shopping');
  }

  public get checkoutButton(): Locator {
    return this.page.getByTestId('checkout');
  }

  public async assertLoaded(): Promise<void> {
    await assertElementsVisible([this.cartList]);
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
    await assertProductDetailsWithQuantity(
      item,
      productName,
      expectedPrice,
      expectedDescription,
      expectedQuantity,
      CART_PRODUCT_SELECTORS
    );
  }

  public async removeProduct(productName: string): Promise<void> {
    const item = this.getCartItemByName(productName);
    const removeButton = item.getByRole('button', { name: 'Remove' });
    await removeButton.click();
  }
}
