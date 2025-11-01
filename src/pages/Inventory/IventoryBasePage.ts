import { Page, Locator } from '@playwright/test';
import BasePage from '../BasePage';
import { CartSelectors } from '../../constants/selectors/shared';

export default class InventoryBasePage extends BasePage {
  constructor(page: Page) {
    super(page, 'inventory.html');
  }

  public get cartBadge(): Locator {
    return this.page.locator(CartSelectors.CART_BADGE);
  }

  public get cartLink(): Locator {
    return this.page.locator(CartSelectors.CART_LINK);
  }
  // TODO: Add locators for the sidebar - sidebar menu, logout, reset app state
}
