import { Page, Locator, expect } from '@playwright/test';
import BasePage from '../BasePage';
import { ButtonSelectors } from '../../constants/selectors/shared';

export class CheckoutStepOnePage extends BasePage {
  constructor(page: Page) {
    super(page, 'checkout-step-one.html');
  }

  public get firstNameInput(): Locator {
    return this.page.getByPlaceholder('First Name');
  }

  public get lastNameInput(): Locator {
    return this.page.getByPlaceholder('Last Name');
  }

  public get postalCodeInput(): Locator {
    return this.page.getByPlaceholder('Zip/Postal Code');
  }

  public get continueButton(): Locator {
    return this.page.locator(ButtonSelectors.BUTTON_PRIMARY);
  }

  public get cancelButton(): Locator {
    return this.page.locator(ButtonSelectors.BUTTON_SECONDARY);
  }

  public get errorMessage(): Locator {
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
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }
}
