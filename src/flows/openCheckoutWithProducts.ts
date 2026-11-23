import type CartPage from '../pages/Cart/CartPage';
import type InventoryPage from '../pages/Inventory/InventoryPage';
import type { Product } from '../types/testData';

export async function openCheckoutWithProducts(
  {
    inventoryPage,
    cartPage,
  }: { inventoryPage: InventoryPage; cartPage: CartPage },
  products: readonly Product[]
): Promise<void> {
  for (const product of products) {
    await inventoryPage.addProductToCart(product.name);
  }

  await inventoryPage.assertCartItemCount(products.length);
  await inventoryPage.cartLink.click();
  await cartPage.assertLoaded();
  await cartPage.checkoutButton.click();
}
