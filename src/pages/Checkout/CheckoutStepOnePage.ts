import { Page, Locator } from '@playwright/test';
import type { CheckoutData } from '../../types/testData';
import BasePage from '../BasePage';
import { assertElementsVisible } from '../../utils/assertions';

export class CheckoutStepOnePage extends BasePage {
  constructor(page: Page) {
    super(page, 'checkout-step-one.html');
  }

  public get firstNameInput(): Locator {
    return this.page.getByTestId('firstName');
  }

  public get lastNameInput(): Locator {
    return this.page.getByTestId('lastName');
  }

  public get postalCodeInput(): Locator {
    return this.page.getByTestId('postalCode');
  }

  public get continueButton(): Locator {
    return this.page.getByTestId('continue');
  }

  public get cancelButton(): Locator {
    return this.page.getByTestId('cancel');
  }

  public get errorMessage(): Locator {
    return this.page.getByTestId('error');
  }

  public async assertLoaded(): Promise<void> {
    await assertElementsVisible([
      this.page.getByTestId('checkout-info-container'),
    ]);
  }

  public async submitCheckoutForm(customer: CheckoutData): Promise<void> {
    await this.fillCheckoutForm(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );
    await this.continueButton.click();
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
