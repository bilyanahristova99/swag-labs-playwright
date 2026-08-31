import { Locator, Page, expect } from '@playwright/test';
import BasePage from '../BasePage';
import ILoginPage from '../../interfaces/ILoginPage';

export default class LoginPage extends BasePage implements ILoginPage {
  constructor(page: Page) {
    super(page, '');
  }

  public get usernameInput(): Locator {
    return this.page.getByTestId('username');
  }

  public get passwordInput(): Locator {
    return this.page.getByTestId('password');
  }

  public get loginButton(): Locator {
    return this.page.getByTestId('login-button');
  }

  public get errorSection(): Locator {
    return this.page.getByTestId('error');
  }

  public async login(username: string, password: string): Promise<void> {
    await this.goto();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.verifyAuthenticationSuccess();
  }

  public async verifyAuthenticationSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
  }
}
