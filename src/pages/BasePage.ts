import { expect, Page, Locator } from '@playwright/test';
import IPage from '../interfaces/IPage';

export default class BasePage implements IPage {
  protected readonly page: Page;
  protected readonly path: string;

  constructor(page: Page, path: string) {
    this.page = page;
    this.path = path;
  }

  public async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  public async waitForLoadState(
    state?: 'load' | 'domcontentloaded' | 'networkidle'
  ): Promise<void> {
    await this.page.waitForLoadState(state);
  }
}
