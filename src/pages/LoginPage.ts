import { Locator, Page, expect } from '@playwright/test';
import BasePage from './BasePage';
import ILoginPage from '../interfaces/ILoginPage';

export default class LoginPage extends BasePage implements ILoginPage {
  constructor(page: Page) {
    super(page, 'index.html');
  }

  public get usernameInput(): Locator {
    return this.page.locator('#user-name');
  }

  public get passwordInput(): Locator {
    return this.page.locator('#password');
  }

  public get loginButton(): Locator {
    return this.page.locator('#login-button');
  }

  public get errorSection(): Locator {
    return this.page.locator('[data-test=error]');
  }

  public async login(username: string, password: string): Promise<void> {
    await this.goto();
    await expect(this.page).toHaveURL(
      'https://www.saucedemo.com/v1/index.html'
    );

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.verifyAuthenticationSuccess();
  }

  public async verifyAuthenticationSuccess(): Promise<void> {
    await this.page.waitForURL('https://www.saucedemo.com/v1/inventory.html');
  }
}
