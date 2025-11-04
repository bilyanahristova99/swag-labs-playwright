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

  public get sidebarMenu(): Locator {
    return this.page.getByRole('button', { name: 'Open Menu' });
  }

  public get sidebarMenuOptions(): Locator {
    return this.page.locator('.bm-item-list > a');
  }

  public get allItemsLink(): Locator {
    return this.sidebarMenuOptions.filter({ hasText: 'All Items' });
  }

  public get aboutLink(): Locator {
    return this.sidebarMenuOptions.filter({ hasText: 'About' });
  }

  public get logoutLink(): Locator {
    return this.sidebarMenuOptions.filter({ hasText: 'Logout' });
  }

  public get resetAppStateLink(): Locator {
    return this.sidebarMenuOptions.filter({ hasText: 'Reset App State' });
  }
}
