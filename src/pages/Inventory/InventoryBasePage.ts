import { Locator, Page } from '@playwright/test';
import BasePage from '../BasePage';

export default class InventoryBasePage extends BasePage {
  constructor(page: Page, path: string) {
    super(page, path);
  }

  public get cartBadge(): Locator {
    return this.page.getByTestId('shopping-cart-badge');
  }

  public get cartLink(): Locator {
    return this.page.getByTestId('shopping-cart-link');
  }

  public get sidebarMenu(): Locator {
    return this.page.getByRole('button', { name: 'Open Menu' });
  }

  public get allItemsLink(): Locator {
    return this.page.getByTestId('inventory-sidebar-link');
  }

  public get aboutLink(): Locator {
    return this.page.getByTestId('about-sidebar-link');
  }

  public get logoutLink(): Locator {
    return this.page.getByTestId('logout-sidebar-link');
  }

  public get resetAppStateLink(): Locator {
    return this.page.getByTestId('reset-sidebar-link');
  }
}
