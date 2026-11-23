import { test, expect } from '../src/fixtures/test.fixture';
import {
  SAUCE_LABS_BACKPACK,
  SAUCE_LABS_BIKE_LIGHT,
  SAUCE_LABS_BOLT_T_SHIRT,
  SAUCE_LABS_FLEECE_JACKET,
} from '../src/constants/products';

test.describe('Dynamic Catalog @inventory', () => {
  test('should append more product variants when scrolling the lazy catalog @positive', async ({
    loggedInInventoryPage,
    dynamicCatalogPage,
  }) => {
    await loggedInInventoryPage.assertLoaded();
    await dynamicCatalogPage.open('Lazy Load');
    const names = dynamicCatalogPage.lazyProductNames;
    await expect(names).toContainText([SAUCE_LABS_BACKPACK.name]);
    const initialNames = await names.allTextContents();

    await dynamicCatalogPage.scrollToMoreProducts();
    await expect.poll(() => names.count()).toBeGreaterThan(initialNames.length);

    const loadedNames = await names.allTextContents();
    expect(loadedNames.slice(0, initialNames.length)).toEqual(initialNames);
    await expect(names).toContainText([
      `${SAUCE_LABS_FLEECE_JACKET.name} (S)`,
      `${SAUCE_LABS_FLEECE_JACKET.name} (M)`,
    ]);
  });

  test('should replace the spinner with the full catalog @positive', async ({
    loggedInInventoryPage,
    dynamicCatalogPage,
  }) => {
    await loggedInInventoryPage.assertLoaded();
    await dynamicCatalogPage.open('Spinner');
    const expectedNames = [
      SAUCE_LABS_BIKE_LIGHT.name,
      SAUCE_LABS_BOLT_T_SHIRT.name,
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
      SAUCE_LABS_BACKPACK.name,
      SAUCE_LABS_FLEECE_JACKET.name,
    ].sort();
    await expect
      .poll(async () =>
        (await dynamicCatalogPage.spinnerProductNames.allTextContents()).sort()
      )
      .toEqual(expectedNames);
    await expect(dynamicCatalogPage.spinner).toBeHidden();
  });

  test('should show the product selected in the slider @positive', async ({
    loggedInInventoryPage,
    dynamicCatalogPage,
  }) => {
    await loggedInInventoryPage.assertLoaded();
    await dynamicCatalogPage.open('Slider');
    await dynamicCatalogPage.selectSlide(SAUCE_LABS_BACKPACK.name);

    await expect(dynamicCatalogPage.slideName).toHaveText(
      SAUCE_LABS_BACKPACK.name
    );
    await expect(dynamicCatalogPage.slidePrice).toHaveText(
      SAUCE_LABS_BACKPACK.price
    );
    await expect(dynamicCatalogPage.slideImage).toBeVisible();
    await expect(dynamicCatalogPage.slideImage).toHaveAttribute(
      'alt',
      SAUCE_LABS_BACKPACK.name
    );
  });
});
