import { Locator, Page } from '@playwright/test';

type CatalogMode = 'Lazy Load' | 'Spinner' | 'Slider';

export default class DynamicCatalogPage {
  constructor(private readonly page: Page) {}

  public async open(mode: CatalogMode): Promise<void> {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.getByRole('button', { name: 'Dynamic Catalog' }).click();
    await this.page.getByRole('button', { name: mode, exact: true }).click();
  }

  public get lazyProductNames(): Locator {
    return this.page.locator(
      '[data-test^="lazy-load-item-"][data-test$="-name"]'
    );
  }

  public async scrollToMoreProducts(): Promise<void> {
    await this.page
      .getByTestId('dynamic-catalog-lazy-load-sentinel')
      .scrollIntoViewIfNeeded();
  }

  public get spinner(): Locator {
    return this.page.getByTestId('dynamic-catalog-spinner');
  }

  public get spinnerProductNames(): Locator {
    return this.page
      .getByTestId('dynamic-catalog-spinner-grid')
      .locator('[data-test$="-name"]');
  }

  public async selectSlide(productName: string): Promise<void> {
    await this.page
      .getByRole('button', { name: `Show ${productName}`, exact: true })
      .click();
  }

  public get slideName(): Locator {
    return this.page.getByTestId('dynamic-catalog-slider-item-name');
  }

  public get slidePrice(): Locator {
    return this.page.getByTestId('dynamic-catalog-slider-item-price');
  }

  public get slideImage(): Locator {
    return this.page.getByTestId('dynamic-catalog-slider-item-img');
  }
}
