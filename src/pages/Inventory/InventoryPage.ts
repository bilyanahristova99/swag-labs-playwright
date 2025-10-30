import { Page, expect, Locator } from '@playwright/test';
import BasePage from '../BasePage';
import { FILTER_OPTIONS } from '../../constants/enums';
import {
  CartSelectors,
  InventorySelectors,
} from '../../constants/selectors/shared';

export default class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page, 'inventory.html');
  }

  private get inventoryContainer(): Locator {
    return this.page.locator('.inventory_list');
  }

  private get cartBadge(): Locator {
    return this.page.locator(CartSelectors.CART_BADGE);
  }

  public get cartLink(): Locator {
    return this.page.locator(CartSelectors.CART_LINK);
  }

  public get sortDropdown(): Locator {
    return this.page.locator('.product_sort_container');
  }

  private get inventoryItem(): Locator {
    return this.page.locator('.inventory_item');
  }

  public async assertLoaded(): Promise<void> {
    await expect(this.inventoryContainer).toBeVisible();
  }

  public async goToProductDetail(productName: string): Promise<void> {
    const productItem = this.getProductItemByName(productName);
    const productNameLink = productItem.locator(
      InventorySelectors.INVENTORY_ITEM_NAME
    );
    await productNameLink.click();
  }

  public async addProductToCart(productName: string): Promise<void> {
    const productItem = this.getProductItemByName(productName);
    const addButton = productItem
      .getByRole('button')
      .filter({ hasText: 'Add to cart' });
    await addButton.click();
  }

  public async removeProductFromCart(productName: string): Promise<void> {
    const productItem = this.getProductItemByName(productName);
    const removeButton = productItem
      .getByRole('button')
      .filter({ hasText: 'Remove' });
    await removeButton.click();
  }

  public async assertCartItemCount(expectedCount: number): Promise<void> {
    if (expectedCount === 0) {
      // When cart is empty, the badge element is not rendered and is hidden
      await expect(this.cartBadge).toBeHidden();
    } else {
      await expect(this.cartBadge).toBeVisible();
      await expect(this.cartBadge).toHaveText(expectedCount.toString());
    }
  }

  public async sortBy(sortOption: FILTER_OPTIONS): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
  }

  private async getProductNames(): Promise<string[]> {
    const productElements = this.page.locator(
      InventorySelectors.INVENTORY_ITEM_NAME
    );
    const names: string[] = [];
    const count = await productElements.count();

    for (let i = 0; i < count; i += 1) {
      const name = await productElements.nth(i).textContent();
      if (name) names.push(name);
    }

    return names;
  }

  private async getProductPrices(): Promise<string[]> {
    const priceElements = this.page.locator(
      InventorySelectors.INVENTORY_ITEM_PRICE
    );
    const prices: string[] = [];
    const count = await priceElements.count();

    for (let i = 0; i < count; i++) {
      const priceText = await priceElements.nth(i).textContent();
      if (priceText) prices.push(priceText);
    }

    return prices;
  }

  public async assertAddButtonVisible(productName: string): Promise<void> {
    const productItem = this.getProductItemByName(productName);
    await expect(
      productItem.getByRole('button', { name: 'Add to cart' })
    ).toBeVisible();
  }

  public async assertRemoveButtonVisible(productName: string): Promise<void> {
    const productItem = this.getProductItemByName(productName);
    await expect(
      productItem.getByRole('button', { name: 'Remove' })
    ).toBeVisible();
  }

  public async assertProductsSortedByName(
    order: FILTER_OPTIONS
  ): Promise<void> {
    const names = await this.getProductNames();

    if (order === FILTER_OPTIONS.NAME_A_TO_Z) {
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    } else {
      const sortedNames = [...names].sort().reverse();
      expect(names).toEqual(sortedNames);
    }
  }

  public async assertProductsSortedByPrice(
    order: FILTER_OPTIONS
  ): Promise<void> {
    const priceStrings = await this.getProductPrices();
    const prices = priceStrings.map(price =>
      parseFloat(price.replace('$', ''))
    );

    if (order === FILTER_OPTIONS.PRICE_LOW_TO_HIGH) {
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sortedPrices);
    } else {
      const sortedPrices = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sortedPrices);
    }
  }

  private getProductItemByName(productName: string): Locator {
    return this.inventoryItem.filter({ hasText: productName });
  }

  public async assertProductName(productName: string): Promise<void> {
    const productItem = this.getProductItemByName(productName);
    await expect(
      productItem.locator(InventorySelectors.INVENTORY_ITEM_NAME)
    ).toHaveText(productName);
  }

  public async assertProductPrice(
    productName: string,
    price: string
  ): Promise<void> {
    const item = this.getProductItemByName(productName);
    await expect(
      item.locator(InventorySelectors.INVENTORY_ITEM_PRICE)
    ).toHaveText(price);
  }

  public async assertProductDescription(
    productName: string,
    description: string
  ): Promise<void> {
    const item = this.getProductItemByName(productName);
    await expect(
      item.locator(InventorySelectors.INVENTORY_ITEM_DESCRIPTION)
    ).toHaveText(description);
  }

  public async assertProductImage(productName: string): Promise<void> {
    const item = this.getProductItemByName(productName);
    await expect(
      item.locator(InventorySelectors.INVENTORY_ITEM_IMAGE).getByRole('img')
    ).toBeVisible();
    await expect(
      item.locator(InventorySelectors.INVENTORY_ITEM_IMAGE).getByRole('img')
    ).toHaveAttribute('src');
  }

  public async assertProductElements(
    productName: string,
    price: string,
    description: string
  ): Promise<void> {
    const productItem = this.getProductItemByName(productName);
    await expect(productItem).toBeVisible();
    await this.assertProductName(productName);
    await this.assertProductPrice(productName, price);
    await this.assertProductDescription(productName, description);
  }
}
