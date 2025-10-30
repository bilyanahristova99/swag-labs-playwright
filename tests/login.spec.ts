import { test, expect } from '@playwright/test';
import LoginPage from '../src/pages/LoginPage';
import {
  STANDARD_USER,
  LOCKED_OUT_USER,
  PERFORMANCE_GLITCH_USER,
} from '../src/constants/users';

test.describe('Login Page @login', () => {
  let loginPage: LoginPage;

  const emeptyUsernameError = 'Epic sadface: Username is required';
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

  test('valid login with standard user @positive', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.usernameInput.fill(STANDARD_USER.username);
    await expect(loginPage.passwordInput).toBeVisible();
    await loginPage.passwordInput.fill(STANDARD_USER.password);
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.loginButton.click();
    await loginPage.verifyAuthenticationSuccess();
  });

  test('performance glitch user can login @positive', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.usernameInput.fill(PERFORMANCE_GLITCH_USER.username);
    await expect(loginPage.passwordInput).toBeVisible();
    await loginPage.passwordInput.fill(PERFORMANCE_GLITCH_USER.password);
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.loginButton.click();
    await loginPage.verifyAuthenticationSuccess();
  });

  test('empty username shows error @negative', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.passwordInput.fill(STANDARD_USER.password);
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.loginButton.click();
    await expect(loginPage.errorSection).toBeVisible();
    await expect(loginPage.errorSection).toHaveText(emeptyUsernameError);
  });

  test('empty password shows error @negative', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.usernameInput.fill(STANDARD_USER.username);
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.loginButton.click();
    await expect(loginPage.errorSection).toBeVisible();
    await expect(loginPage.errorSection).toHaveText(emptyPasswordError);
  });

  test('valid username but wrong password shows error @negative', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.usernameInput.fill(STANDARD_USER.username);
    await expect(loginPage.passwordInput).toBeVisible();
    await loginPage.passwordInput.fill('wrong_password');
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.loginButton.click();
    await expect(loginPage.errorSection).toBeVisible();
    await expect(loginPage.errorSection).toHaveText(wrongCredentialsError);
  });

  test('locked out user sees error @negative', async () => {
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
