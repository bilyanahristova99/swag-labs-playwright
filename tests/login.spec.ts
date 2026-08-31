import { test, expect } from '../src/fixtures/test.fixture';
import {
  STANDARD_USER,
  LOCKED_OUT_USER,
  PERFORMANCE_GLITCH_USER,
} from '../src/constants/users';
import { assertElementsVisible } from '../src/utils/assertions';

test.describe('Login Page @login', () => {
  const emptyUsernameError = 'Epic sadface: Username is required';
  const emptyPasswordError = 'Epic sadface: Password is required';
  const wrongCredentialsError =
    'Epic sadface: Username and password do not match any user in this service';
  const lockedOutError = 'Epic sadface: Sorry, this user has been locked out.';

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should successfully login with valid standard user credentials @positive', async ({
    loginPage,
  }) => {
    await assertElementsVisible([
      loginPage.usernameInput,
      loginPage.passwordInput,
      loginPage.loginButton,
    ]);
    await loginPage.usernameInput.fill(STANDARD_USER.username);
    await loginPage.passwordInput.fill(STANDARD_USER.password);
    await loginPage.loginButton.click();
    await loginPage.verifyAuthenticationSuccess();
  });

  test('should successfully login with performance glitch user credentials @positive', async ({
    loginPage,
  }) => {
    await assertElementsVisible([
      loginPage.usernameInput,
      loginPage.passwordInput,
      loginPage.loginButton,
    ]);
    await loginPage.usernameInput.fill(PERFORMANCE_GLITCH_USER.username);
    await loginPage.passwordInput.fill(PERFORMANCE_GLITCH_USER.password);
    await loginPage.loginButton.click();
    await loginPage.verifyAuthenticationSuccess();
  });

  test('should display error message when username is empty @negative', async ({
    loginPage,
  }) => {
    await assertElementsVisible([
      loginPage.usernameInput,
      loginPage.loginButton,
    ]);
    await loginPage.passwordInput.fill(STANDARD_USER.password);
    await loginPage.loginButton.click();
    await expect(loginPage.errorSection).toBeVisible();
    await expect(loginPage.errorSection).toHaveText(emptyUsernameError);
  });

  test('should display error message when password is empty @negative', async ({
    loginPage,
  }) => {
    await assertElementsVisible([
      loginPage.usernameInput,
      loginPage.loginButton,
    ]);
    await loginPage.usernameInput.fill(STANDARD_USER.username);
    await loginPage.loginButton.click();
    await expect(loginPage.errorSection).toBeVisible();
    await expect(loginPage.errorSection).toHaveText(emptyPasswordError);
  });

  test('should display error message when password is incorrect @negative', async ({
    loginPage,
  }) => {
    await assertElementsVisible([
      loginPage.usernameInput,
      loginPage.passwordInput,
      loginPage.loginButton,
    ]);
    await loginPage.usernameInput.fill(STANDARD_USER.username);
    await loginPage.passwordInput.fill('wrong_password');
    await loginPage.loginButton.click();
    await expect(loginPage.errorSection).toBeVisible();
    await expect(loginPage.errorSection).toHaveText(wrongCredentialsError);
  });

  test('should display error message when user account is locked out @negative', async ({
    loginPage,
  }) => {
    await assertElementsVisible([
      loginPage.usernameInput,
      loginPage.passwordInput,
      loginPage.loginButton,
    ]);
    await loginPage.usernameInput.fill(LOCKED_OUT_USER.username);
    await loginPage.passwordInput.fill(LOCKED_OUT_USER.password);
    await loginPage.loginButton.click();
    await expect(loginPage.errorSection).toBeVisible();
    await expect(loginPage.errorSection).toHaveText(lockedOutError);
  });
});
