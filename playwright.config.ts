import { defineConfig, devices } from '@playwright/test';

/**
 * Enterprise-grade Playwright Configuration
 * Following industry best practices for comprehensive testing
 */
export default defineConfig({
  // Test directory structure
  testDir: './tests/e2e',

  // Global test timeout
  timeout: 100 * 1000, // 100 seconds per test

  // Expect timeout for assertions
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },

  // Test execution settings - Optimized for Firefox stability
  fullyParallel: true, // Enable parallel execution since Firefox is more stable
  forbidOnly: !!process.env.CI, // Prevent .only() in CI
  retries: process.env.CI ? 2 : 1, // Retry failed tests
  workers: process.env.CI ? 2 : 4, // Increase workers since Firefox handles EPIPE better

  // Global test reporter
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ...(process.env.CI ? [['github']] as const : [['line']] as const),
  ],

  // Global test output
  outputDir: 'test-results/artifacts',

  // Global test options - Optimized for server stability
  use: {
    // Base URL for tests
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure',

    /* Global timeout for each action - Increased for stability */
    actionTimeout: 45000,

    /* Navigation timeout - Increased for stability */
    navigationTimeout: 45000,

    /* Optimized interactions for parallel execution */
    launchOptions: {
      slowMo: 10, // Minimal slowMo for better performance
    },
  },

  /* Configure projects for major browsers - Firefox first for EPIPE stability */
  projects: [
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        // Firefox-specific optimizations for stability with parallelism
        launchOptions: {
          slowMo: 25, // Reduced slowMo for better performance with parallel execution
        }
      },
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true, // Always reuse existing server to avoid EPIPE errors
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  /* Global setup and teardown */
  // globalSetup: './tests/global-setup.ts',
  // globalTeardown: './tests/global-teardown.ts',
});