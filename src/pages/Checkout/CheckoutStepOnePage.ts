import { Page, Locator, expect } from '@playwright/test';
import BasePage from '../BasePage';
import { ButtonSelectors } from '../../constants/selectors/shared';

export class CheckoutStepOnePage extends BasePage {
  constructor(page: Page) {
    super(page, 'checkout-step-one.html');
  }

  private get firstNameInput(): Locator {
    return this.page.getByPlaceholder('First Name');
  }

  private get lastNameInput(): Locator {
    return this.page.getByPlaceholder('Last Name');
  }

  private get postalCodeInput(): Locator {
    return this.page.getByPlaceholder('Zip/Postal Code');
  }

  private get continueButton(): Locator {
    return this.page.locator(ButtonSelectors.BUTTON_PRIMARY);
  }

  private get cancelButton(): Locator {
    return this.page.locator(ButtonSelectors.BUTTON_SECONDARY);
  }

  private get errorMessage(): Locator {
    return this.page.locator('[data-test="error"]');
  }

  public async assertLoaded(): Promise<void> {
    await expect(this.page.locator('.checkout_info')).toBeVisible();
  }

  public async fillCheckoutForm(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  public async clickContinue(): Promise<void> {
    await expect(this.continueButton).toBeVisible();
    await expect(this.continueButton).toBeEnabled();
    await this.continueButton.click();
  }

  public async clickCancel(): Promise<void> {
    await expect(this.cancelButton).toBeVisible();
    await expect(this.cancelButton).toBeEnabled();
    await this.cancelButton.click();
  }

  public async assertErrorMessageVisible(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }
}
