import { test, expect } from '@playwright/test';
import LoginPage from '../src/pages/Login/LoginPage';
import {
  STANDARD_USER,
  LOCKED_OUT_USER,
  PERFORMANCE_GLITCH_USER,
} from '../src/constants/users';

test.describe('Login Page @login', () => {
  let loginPage: LoginPage;

  const emptyUsernameError = 'Epic sadface: Username is required';
  const emptyPasswordError = 'Epic sadface: Password is required';
  const wrongCredentialsError =
    'Epic sadface: Username and password do not match any user in this service';
  const lockedOutError = 'Epic sadface: Sorry, this user has been locked out.';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginPage.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('should successfully login with valid standard user credentials @positive', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.usernameInput.fill(STANDARD_USER.username);
    await expect(loginPage.passwordInput).toBeVisible();
    await loginPage.passwordInput.fill(STANDARD_USER.password);
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.loginButton.click();
    await loginPage.verifyAuthenticationSuccess();
  });

  test('should successfully login with performance glitch user credentials @positive', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.usernameInput.fill(PERFORMANCE_GLITCH_USER.username);
    await expect(loginPage.passwordInput).toBeVisible();
    await loginPage.passwordInput.fill(PERFORMANCE_GLITCH_USER.password);
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.loginButton.click();
    await loginPage.verifyAuthenticationSuccess();
  });

  test('should display error message when username is empty @negative', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.passwordInput.fill(STANDARD_USER.password);
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.loginButton.click();
    await expect(loginPage.errorSection).toBeVisible();
    await expect(loginPage.errorSection).toHaveText(emptyUsernameError);
  });

  test('should display error message when password is empty @negative', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.usernameInput.fill(STANDARD_USER.username);
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.loginButton.click();
    await expect(loginPage.errorSection).toBeVisible();
    await expect(loginPage.errorSection).toHaveText(emptyPasswordError);
  });

  test('should display error message when password is incorrect @negative', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.usernameInput.fill(STANDARD_USER.username);
    await expect(loginPage.passwordInput).toBeVisible();
    await loginPage.passwordInput.fill('wrong_password');
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.loginButton.click();
    await expect(loginPage.errorSection).toBeVisible();
    await expect(loginPage.errorSection).toHaveText(wrongCredentialsError);
  });

  test('should display error message when user account is locked out @negative', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.usernameInput.fill(LOCKED_OUT_USER.username);
    await expect(loginPage.passwordInput).toBeVisible();
    await loginPage.passwordInput.fill(LOCKED_OUT_USER.password);
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.loginButton.click();
    await expect(loginPage.errorSection).toBeVisible();
    await expect(loginPage.errorSection).toHaveText(lockedOutError);
  });
});
