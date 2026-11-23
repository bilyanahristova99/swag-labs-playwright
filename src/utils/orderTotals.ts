import type { Product } from '../types/testData';

// Sauce Demo uses an 8% tax on the order subtotal.
const TAX_PERCENT = 8;

/**
 * Calculates the expected checkout price breakdown from test product prices.
 * The calculation uses whole cents and rounds the tax on the subtotal to the
 * nearest cent before adding it to the total.
 *
 * @param products - Products with dollar-formatted prices (e.g., '$29.99')
 * @returns The subtotal, tax, and total formatted as US dollar amounts
 * @example
 * const expected = calculateExpectedOrderTotals([SAUCE_LABS_BACKPACK]);
 * await expect(overview.summaryTotal).toHaveText(`Total: ${expected.total}`);
 */
export function calculateExpectedOrderTotals(
  products: readonly Pick<Product, 'price'>[]
) {
  const subtotalCents = products.reduce(
    (subtotal, { price }) =>
      subtotal + Math.round(Number(price.slice(1)) * 100),
    0
  );
  const taxCents = Math.round((subtotalCents * TAX_PERCENT) / 100);

  return {
    subtotal: formatDollars(subtotalCents),
    tax: formatDollars(taxCents),
    total: formatDollars(subtotalCents + taxCents),
  };
}

function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
