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

  const backTop = page.getByRole('button', { name: 'Positioned back top' });
  await backTop.hover();
  const backTopTooltip = page.getByRole('tooltip', { name: 'Positioned back top tooltip' });
  await expect(backTopTooltip).toBeVisible();
  await expect(backTopTooltip).toHaveCSS('pointer-events', 'none');
  const [backTopBox, backTopTooltipBox] = await Promise.all([backTop.boundingBox(), backTopTooltip.boundingBox()]);
  expect(backTopBox).not.toBeNull();
  expect(backTopTooltipBox).not.toBeNull();
  expect(backTopTooltipBox!.x + backTopTooltipBox!.width).toBeLessThan(backTopBox!.x);
  expect(Math.abs(backTopTooltipBox!.y + backTopTooltipBox!.height / 2 - (backTopBox!.y + backTopBox!.height / 2))).toBeLessThan(2);

  await page.getByRole('button', { name: 'Show tooltip' }).click();
  const splitTooltip = page.getByRole('tooltip', { name: 'Split CSS tooltip' });
  await expect(splitTooltip).toHaveText('Split CSS tooltip');
  await expect(splitTooltip).toHaveCSS('position', 'fixed');

  expect(await page.evaluate(() => ({
    bodyMargin: getComputedStyle(document.body).margin,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }))).toEqual({ bodyMargin: '0px', overflow: false });
});
