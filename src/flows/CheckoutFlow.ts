import type { CheckoutData, Product } from '../types/testData';
import InventoryPage from '../pages/Inventory/InventoryPage';
import CartPage from '../pages/Cart/CartPage';
import { CheckoutStepOnePage } from '../pages/Checkout/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/Checkout/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/Checkout/CheckoutCompletePage';

export default class CheckoutFlow {
  constructor(
    private readonly inventoryPage: InventoryPage,
    private readonly cartPage: CartPage,
    private readonly checkoutStepOnePage: CheckoutStepOnePage,
    private readonly checkoutStepTwoPage: CheckoutStepTwoPage,
    private readonly checkoutCompletePage: CheckoutCompletePage
  ) {}

  public async openStepOne(
    products: Product | Product[]
  ): Promise<CheckoutStepOnePage> {
    const selectedProducts = Array.isArray(products) ? products : [products];

    for (const product of selectedProducts) {
      await this.inventoryPage.addProductToCart(product.name);
    }

    await this.inventoryPage.assertCartItemCount(selectedProducts.length);
    await this.inventoryPage.cartLink.click();
    await this.cartPage.assertLoaded();

    return this.openStepOneFromCart();
  }

  public async openStepOneFromCart(): Promise<CheckoutStepOnePage> {
    await this.cartPage.checkoutButton.click();
    await this.checkoutStepOnePage.assertLoaded();

    return this.checkoutStepOnePage;
  }

  public async openStepTwo(
    products: Product | Product[],
    customer: CheckoutData
  ): Promise<CheckoutStepTwoPage> {
    await this.openStepOne(products);

    return this.openStepTwoFromCurrentStep(customer);
  }

  public async openStepTwoFromCurrentStep(
    customer: CheckoutData
  ): Promise<CheckoutStepTwoPage> {
    await this.checkoutStepOnePage.fillCheckoutForm(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );
    await this.checkoutStepOnePage.continueButton.click();
    await this.checkoutStepTwoPage.assertLoaded();

    return this.checkoutStepTwoPage;
  }

  public async completeOrder(
    products: Product | Product[],
    customer: CheckoutData
  ): Promise<CheckoutCompletePage> {
    await this.openStepTwo(products, customer);

    return this.completeOrderFromOverview();
  }

  public async completeOrderFromOverview(): Promise<CheckoutCompletePage> {
    await this.checkoutStepTwoPage.finishButton.click();
    await this.checkoutCompletePage.assertLoaded();

    return this.checkoutCompletePage;
  }
}
