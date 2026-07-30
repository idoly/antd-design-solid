import { defineConfig, devices } from '@playwright/test';

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const chromiumLaunch = { executablePath, args: ['--disable-gpu', '--disable-software-rasterizer', '--enable-precise-memory-info'] };
const chromiumProjects = [
  { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, launchOptions: chromiumLaunch } },
  { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 412, height: 915 }, launchOptions: chromiumLaunch } },
];
const crossBrowserProjects = executablePath ? [] : [
  { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } } },
  ...(process.env.PLAYWRIGHT_INCLUDE_WEBKIT ? [{ name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } } }] : []),
];

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  expect: {
    toHaveScreenshot: { animations: 'disabled', maxDiffPixelRatio: 0.01 },
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [...chromiumProjects, ...crossBrowserProjects],
});
