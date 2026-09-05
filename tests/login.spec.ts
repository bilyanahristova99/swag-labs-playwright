import { test, expect } from '../src/fixtures/test.fixture';
import {
  STANDARD_USER,
  LOCKED_OUT_USER,
  PERFORMANCE_GLITCH_USER,
} from '../src/constants/users';
import { assertElementsVisible } from '../src/utils/assertions';

const validationCases = [
  {
    name: 'username is empty',
    username: '',
    password: STANDARD_USER.password,
    expectedError: 'Epic sadface: Username is required',
  },
  {
    name: 'password is empty',
    username: STANDARD_USER.username,
    password: '',
    expectedError: 'Epic sadface: Password is required',
  },
  {
    name: 'password is incorrect',
    username: STANDARD_USER.username,
    password: 'wrong_password',
    expectedError:
      'Epic sadface: Username and password do not match any user in this service',
  },
  {
    name: 'user account is locked out',
    username: LOCKED_OUT_USER.username,
    password: LOCKED_OUT_USER.password,
    expectedError: 'Epic sadface: Sorry, this user has been locked out.',
  },
];

test.describe('Login Page @login', () => {
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
    await loginPage.submitCredentials(
      STANDARD_USER.username,
      STANDARD_USER.password
    );
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
    await loginPage.submitCredentials(
      PERFORMANCE_GLITCH_USER.username,
      PERFORMANCE_GLITCH_USER.password
    );
    await loginPage.verifyAuthenticationSuccess();
  });

  for (const { name, username, password, expectedError } of validationCases) {
    test(`should display an error when ${name} @negative`, async ({
      loginPage,
    }) => {
      await assertElementsVisible([
        loginPage.usernameInput,
        loginPage.passwordInput,
        loginPage.loginButton,
      ]);
      await loginPage.submitCredentials(username, password);

      await expect(loginPage.errorSection).toBeVisible();
      await expect(loginPage.errorSection).toHaveText(expectedError);
    });
  }
});
