import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('renders the responsive workbench without page overflow', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Ant Design Solid workbench' })).toBeVisible();
  await expect(page.locator('#overview')).toBeVisible();
  await expect(page.locator('#entry')).toBeAttached();
  await expect(page.locator('#display')).toBeAttached();
  await expect(page.locator('#feedback')).toBeAttached();
  await expect(page.locator('#extensions')).toBeAttached();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  if (process.env.PLAYWRIGHT_SKIP_SCREENSHOTS) return;

  if (testInfo.project.name === 'desktop') await expect(page).toHaveScreenshot('workbench-desktop.png');
  if (testInfo.project.name === 'mobile') await expect(page).toHaveScreenshot('workbench-mobile.png');
});

for (const mode of ['dark', 'compact', 'rtl'] as const) {
  test(`renders ${mode} display mode without overflow`, async ({ page }, testInfo) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Display: light' }).click({ force: true });
    await page.getByRole('menuitem', { name: mode === 'dark' ? 'Dark theme' : mode === 'compact' ? 'Compact theme' : 'RTL preview' }).click({ force: true });
    await expect(page.getByRole('button', { name: `Display: ${mode}` })).toBeVisible();
    if (mode === 'rtl') await expect(page.locator('.ads-root').first()).toHaveAttribute('dir', 'rtl');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    if (!process.env.PLAYWRIGHT_SKIP_SCREENSHOTS && (testInfo.project.name === 'desktop' || testInfo.project.name === 'mobile')) await expect(page).toHaveScreenshot(`workbench-${mode}-${testInfo.project.name}.png`);
  });
}

test('supports table filtering, row expansion, and date confirmation', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.locator('#display').evaluate((element) => element.scrollIntoView({ block: 'start' }));

  await page.getByLabel('Filter Role').click({ force: true });
  await page.getByRole('checkbox', { name: 'Engineer' }).click({ force: true });
  const table = page.locator('.ads-table');
  await expect(table.getByRole('cell', { name: 'Grace Hopper' })).toBeVisible();
  await expect(table.getByRole('cell', { name: 'Ada Lovelace' })).toHaveCount(0);

  if (testInfo.project.name === 'desktop') {
    await table.getByRole('button', { name: 'Expand row' }).first().click({ force: true });
    await expect(page.getByText('Member:').first()).toBeVisible();
  }

  await page.locator('#entry').evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.getByRole('textbox', { name: 'Release date' }).click({ force: true });
  await page.getByRole('button', { name: 'Release day' }).click({ force: true });
  await page.getByRole('button', { name: 'OK', exact: true }).click({ force: true });
  await expect(page.getByRole('textbox', { name: 'Release date' })).toHaveValue('2026-07-30');
});

test('keeps the workbench free of serious accessibility violations', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One viewport is sufficient for the automated axe gate.');
  await page.goto('/');
  const results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
  const blocking = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious');
  expect(blocking, blocking.map((violation) => `${violation.id}: ${violation.help}`).join('\n')).toEqual([]);
});

test('keeps modal and date-picker portals free of serious accessibility violations', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Portal axe coverage uses the Chromium desktop project.');
  await page.goto('/');
  await page.getByRole('button', { name: 'Create workspace' }).click();
  const workspaceDialog = page.getByRole('dialog', { name: 'Create workspace' });
  await expect(workspaceDialog).toBeVisible();
  let results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
  expect(results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')).toEqual([]);
  await workspaceDialog.press('Escape');
  await expect(workspaceDialog).toBeHidden();

  await page.locator('#entry').evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.getByRole('textbox', { name: 'Release date' }).click();
  await expect(page.getByRole('application', { name: 'Date picker' })).toBeVisible();
  results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
  expect(results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')).toEqual([]);
});

test('supports reduced motion and forced colors without overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Ant Design Solid workbench' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: 'Display: light' }).click({ force: true });
  await page.getByRole('menuitem', { name: 'Compact theme' }).click({ force: true });
  await expect(page.getByRole('button', { name: 'Display: compact' })).toBeVisible();
});

test('virtualizes 10,000 Table rows under real browser scrolling and updates', async ({ context, page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'The performance budget uses the stable desktop viewport.');
  await page.goto('/tests/e2e/virtual-table.html');
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  const mountMs = Number(await page.locator('body').getAttribute('data-mount-ms'));
  const readyMs = Number(await page.locator('body').getAttribute('data-ready-ms'));
  expect(mountMs).toBeLessThan(1500);
  expect(readyMs).toBeLessThan(2000);
  const cdp = await context.newCDPSession(page);
  await cdp.send('HeapProfiler.collectGarbage');
  const heapBefore = await page.evaluate(() => (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ?? 0);

  const table = page.locator('.ads-table');
  const viewport = table.locator(':scope > .overflow-auto');
  await expect(table.locator('tbody tr[data-index]').first()).toBeVisible();
  expect(await table.locator('tbody tr[data-index]').count()).toBeLessThan(50);

  await page.evaluate(() => window.virtualTableRef?.scrollTo({ index: 7000, align: 'start' }));
  await expect.poll(async () => Number(await table.locator('tbody tr[data-index]').first().getAttribute('data-index'))).toBeGreaterThan(6500);
  const offset = await viewport.evaluate((element) => element.scrollTop);
  expect(offset).toBeGreaterThan(300_000);

  await table.getByRole('button', { name: 'Expand row' }).first().click();
  const expanded = table.locator('.ads-table-expanded-row');
  await expect(expanded).toBeVisible();
  expect(await expanded.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThan(70);
  expect(await table.locator('tbody tr[data-index]').count()).toBeLessThan(50);
  await table.getByRole('button', { name: 'Collapse row' }).first().click();
  await expect(expanded).toHaveCount(0);
  await expect.poll(async () => Math.abs(await viewport.evaluate((element) => element.scrollTop) - offset)).toBeLessThanOrEqual(3);

  await page.getByRole('button', { name: 'Append 1000' }).click();
  await expect(page.getByRole('status', { name: 'Row count' })).toHaveText('11000');
  await expect.poll(async () => Math.abs(await viewport.evaluate((element) => element.scrollTop) - offset)).toBeLessThanOrEqual(3);
  expect(await table.locator('tbody tr[data-index]').count()).toBeLessThan(50);

  await page.getByRole('button', { name: 'Reverse rows' }).click();
  await expect.poll(async () => Math.abs(await viewport.evaluate((element) => element.scrollTop) - offset)).toBeLessThanOrEqual(3);
  await expect(table.getByText(/Record /).first()).toBeVisible();
  await cdp.send('HeapProfiler.collectGarbage');
  const heapAfter = await page.evaluate(() => (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ?? 0);
  expect(heapAfter).toBeLessThan(192 * 1024 * 1024);
  if (heapBefore > 0) expect(heapAfter - heapBefore).toBeLessThan(64 * 1024 * 1024);
});

for (const mode of ['light', 'dark'] as const) {
  test(`renders the ${mode} component state matrix`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop' && testInfo.project.name !== 'mobile', 'Visual baselines are pinned to Chromium.');
    await page.goto(`/tests/e2e/component-states.html${mode === 'dark' ? '?dark=1' : ''}`);
    await page.getByRole('textbox', { name: 'Focused field' }).focus();
    await expect(page.getByRole('heading', { name: 'Component state matrix' })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    if (!process.env.PLAYWRIGHT_SKIP_SCREENSHOTS) {
      await expect(page).toHaveScreenshot(`component-states-${mode}-${testInfo.project.name}.png`);
      await expect(page.getByTestId('action-states')).toHaveScreenshot(`action-states-${mode}-${testInfo.project.name}.png`);
      await expect(page.getByTestId('field-states')).toHaveScreenshot(`field-states-${mode}-${testInfo.project.name}.png`);
      await expect(page.getByTestId('choice-states')).toHaveScreenshot(`choice-states-${mode}-${testInfo.project.name}.png`);
      await expect(page.getByTestId('feedback-states')).toHaveScreenshot(`feedback-states-${mode}-${testInfo.project.name}.png`);
    }
  });
}

test('applies numeric component tokens as valid computed CSS values', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Computed token coverage uses the Chromium desktop project.');
  await page.goto('/tests/e2e/component-states.html?tokens=1');
  const inputNumber = page.getByRole('spinbutton', { name: 'Numeric field' }).locator('..');
  await expect(inputNumber).toHaveCSS('width', '112px');
  const mentions = page.getByRole('textbox', { name: 'Review mentions' });
  await expect(mentions).toHaveCSS('padding-top', '9px');
  await expect(mentions).toHaveCSS('padding-left', '18px');
  await expect(mentions).toHaveCSS('font-size', '17px');
  await expect(mentions).toHaveCSS('background-color', 'rgb(240, 255, 238)');
  const currentPage = page.getByRole('navigation', { name: 'State pagination' }).getByRole('button', { name: 'Page 2' });
  await expect(currentPage).toHaveCSS('width', '36px');
  await expect(currentPage).toHaveCSS('height', '36px');
  await expect(currentPage).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await expect(currentPage).toHaveCSS('color', 'rgb(254, 220, 186)');
  await expect(page.getByRole('textbox', { name: 'Quick jump page' })).toHaveCSS('background-color', 'rgb(238, 247, 255)');
  const smallCard = page.getByTestId('state-card-small');
  await expect(smallCard.locator('.ads-card-header')).toHaveCSS('padding-left', '11px');
  await expect(smallCard.locator('.ads-card-header-wrapper')).toHaveCSS('min-height', '34px');
  await expect(smallCard.locator('.ads-card-title')).toHaveCSS('font-size', '15px');
  await expect(smallCard.locator('.ads-card-body')).toHaveCSS('padding-top', '13px');
  const stateCard = page.getByTestId('state-card');
  await expect(stateCard.locator('.ads-card-header')).toHaveCSS('padding-left', '20px');
  await expect(stateCard.locator('.ads-card-header')).toHaveCSS('background-color', 'rgb(232, 242, 255)');
  await expect(stateCard.locator('.ads-card-header-wrapper')).toHaveCSS('min-height', '48px');
  await expect(stateCard.locator('.ads-card-title')).toHaveCSS('font-size', '18px');
  await expect(stateCard.locator('.ads-card-extra')).toHaveCSS('color', 'rgb(139, 47, 76)');
  await expect(stateCard.locator('.ads-card-body')).toHaveCSS('padding-top', '19px');
  await expect(stateCard.locator('.ads-card-tabs')).toHaveCSS('margin-bottom', '-14px');
  await expect(stateCard.locator('.ads-card-actions')).toHaveCSS('background-color', 'rgb(241, 248, 233)');
  await expect(stateCard.getByRole('button', { name: 'Approve' })).toHaveCSS('margin-top', '4px');
  const layoutHeader = page.getByText('Release workspace');
  await expect(layoutHeader).toHaveCSS('height', '44px');
  await expect(layoutHeader).toHaveCSS('padding-left', '17px');
  await expect(layoutHeader).toHaveCSS('color', 'rgb(247, 215, 116)');
  await expect(layoutHeader).toHaveCSS('background-color', 'rgb(23, 50, 77)');
  await expect(page.locator('.ads-layout-sider').last()).toHaveCSS('background-color', 'rgb(35, 79, 99)');
  await expect(page.getByRole('button', { name: 'Collapse sidebar' })).toHaveCSS('height', '34px');
  await expect(page.getByText('Release status')).toHaveCSS('padding-top', '7px');
  const checkedSwitch = page.getByRole('switch').first();
  await expect(checkedSwitch).toHaveCSS('min-width', '48px');
  await expect(checkedSwitch).toHaveCSS('height', '24px');
  await expect(checkedSwitch.locator('span').first()).toHaveCSS('width', '20px');
  await expect(checkedSwitch.locator('span').first()).toHaveCSS('background-color', 'rgb(255, 238, 204)');
  const selectedMenuItem = page.getByRole('menu', { name: 'Token menu' }).getByRole('menuitem', { name: 'Overview' });
  await expect(selectedMenuItem).toHaveCSS('height', '37px');
  await expect(selectedMenuItem).toHaveCSS('padding-left', '17px');
  await expect(selectedMenuItem).toHaveCSS('border-radius', '7px');
  await expect(selectedMenuItem).toHaveCSS('background-color', 'rgb(18, 58, 188)');
  await expect(selectedMenuItem).toHaveCSS('color', 'rgb(254, 220, 186)');
  const choiceStates = page.getByTestId('choice-states');
  const selectedTab = choiceStates.getByRole('tab', { name: 'Details' });
  await expect(selectedTab).toHaveCSS('color', 'rgb(18, 52, 86)');
  await expect(selectedTab).toHaveCSS('font-size', '15px');
  await expect(selectedTab.locator('..')).toHaveCSS('height', '38px');
  await expect(choiceStates.getByRole('tab', { name: 'Activity' }).locator('..')).toHaveCSS('background-color', 'rgb(221, 238, 255)');
  await expect(choiceStates.getByRole('tablist')).toHaveCSS('gap', '6px');
  const slider = page.getByRole('slider', { name: 'Choice slider' });
  await expect(slider.locator('..').locator('[aria-hidden="true"]')).toHaveCSS('width', '18px');
  await expect(slider.locator('..')).toHaveCSS('height', '8px');
  const radioButton = page.getByRole('radio', { name: 'Grid' }).locator('..');
  await expect(radioButton).toHaveCSS('padding-left', '19px');
  await expect(radioButton).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  const progressRail = page.getByRole('progressbar', { name: 'Build progress' }).locator('.overflow-hidden');
  await expect(progressRail).toHaveCSS('background-color', 'rgb(221, 238, 255)');
  await expect(progressRail).toHaveCSS('border-radius', '7px');
  const describedAlert = page.getByText('Version 6 compatibility metadata is ready.').locator('..').locator('..');
  await expect(describedAlert).toHaveCSS('padding-top', '18px');
  await expect(describedAlert.locator('[aria-hidden="true"]')).toHaveCSS('width', '26px');
  await expect(page.getByRole('status', { name: 'Loading data' }).locator('.ads-spin')).toHaveCSS('width', '24px');
  await expect(page.locator('.ads-skeleton').first().locator('.h-4')).toHaveCSS('height', '18px');
});

test('keeps light and dark component state matrices free of serious accessibility violations', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Focused state axe coverage uses the Chromium desktop project.');
  for (const suffix of ['', '?dark=1']) {
    await page.goto(`/tests/e2e/component-states.html${suffix}`);
    await page.getByRole('textbox', { name: 'Focused field' }).focus();
    const results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
    const blocking = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious');
    expect(blocking, blocking.map((violation) => `${violation.id}: ${violation.help}`).join('\n')).toEqual([]);
  }
});

test('supports touch-style carousel swipes on the mobile viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Touch input is covered by the mobile Chromium project.');
  await page.goto('/');
  await page.locator('#display').evaluate((element) => element.scrollIntoView({ block: 'start' }));
  const carousel = page.locator('.ads-carousel').first();
  await expect(carousel.getByRole('group', { name: '1 of 2' })).toHaveAttribute('aria-hidden', 'false');
  const box = await carousel.boundingBox();
  expect(box).not.toBeNull();
  await carousel.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: box!.x + box!.width * 0.8, clientY: box!.y + box!.height / 2 });
  await carousel.dispatchEvent('pointerup', { pointerType: 'touch', clientX: box!.x + box!.width * 0.2, clientY: box!.y + box!.height / 2 });
  await expect(carousel.getByRole('group', { name: '2 of 2' })).toHaveAttribute('aria-hidden', 'false');
});

test('loads carousel media', async ({ page }) => {
  await page.goto('/');
  await page.locator('#display').evaluate((element) => element.scrollIntoView({ block: 'start' }));
  const images = page.locator('img[alt="Team workspace"], img[alt="Product studio"]');
  await expect(images).toHaveCount(2);
  await expect.poll(async () => images.evaluateAll((items) => items.every((item) => (item as HTMLImageElement).complete && (item as HTMLImageElement).naturalWidth > 0))).toBe(true);
});
