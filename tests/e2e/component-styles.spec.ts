import { expect, test } from '@playwright/test';

test('renders component-level CSS without the full stylesheet', async ({ page }) => {
  await page.goto('/tests/e2e/component-styles.html');

  const button = page.getByRole('button', { name: 'Split CSS button' });
  await expect(button).toHaveCSS('height', '32px');
  await expect(button).toHaveCSS('background-color', 'rgb(22, 119, 255)');
  await button.focus();
  await expect(button).not.toHaveCSS('box-shadow', 'none');

  const floatButton = page.getByRole('button', { name: 'Split CSS float' });
  await expect(floatButton).toHaveCSS('width', '40px');
  await expect(floatButton).toHaveCSS('height', '40px');

  await page.getByRole('button', { name: 'Show tooltip' }).click();
  await expect(page.getByRole('tooltip')).toHaveText('Split CSS tooltip');
  await expect(page.getByRole('tooltip')).toHaveCSS('position', 'fixed');

  expect(await page.evaluate(() => ({
    bodyMargin: getComputedStyle(document.body).margin,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }))).toEqual({ bodyMargin: '0px', overflow: false });
});
