import { defineConfig } from '@playwright/test';

// E2E config for the auth flows. Boots `next dev` and runs Chromium against it.
// The phone-OTP flow is fully testable because dev mode surfaces the OTP in the
// UI (no SMS provider needed). Google OAuth is not E2E'd here (needs live creds).
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  // One retry absorbs the first-test flake while `next dev` compiles the auth
  // routes for the first time (cold start). Warm routes pass on the first try.
  retries: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 180_000,
    // All tests share the localhost IP; give the per-IP OTP limiter headroom so
    // the suite isn't throttled (production keeps the default 5/min).
    env: { OTP_IP_LIMIT_PER_MIN: '200' },
  },
});
