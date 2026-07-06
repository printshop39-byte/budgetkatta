import { defineConfig, devices } from '@playwright/test';

// Cross-browser: the full suite runs on Chromium; the security-critical subset
// (login, open-redirect, /admin authz, logged-out redirect) also runs on
// Firefox, WebKit (≈ Safari engine), and a mobile viewport.
const CORE = /happy path|SECURITY|logged out/;
// WebKit-on-Windows hangs page interactions against Next's DEV server (HMR
// websocket) — a dev-only quirk. Run login smoke on WebKit here; the full
// security matrix runs on Chromium/Firefox/Mobile, and WebKit is re-verified
// against the production preview build (no HMR) during the deploy gate.
const SMOKE = /happy path|logged out/;

// E2E config for the auth flows. Boots `next dev` and runs Chromium against it.
// The phone-OTP flow is fully testable because dev mode surfaces the OTP in the
// UI (no SMS provider needed). Google OAuth is not E2E'd here (needs live creds).
export default defineConfig({
  testDir: './e2e',
  // Generous: dev-server first-compile + the slower WebKit engine need headroom.
  timeout: 90_000,
  globalSetup: './e2e/global-setup.ts',
  expect: { timeout: 20_000 },
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
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, grep: CORE },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, grep: SMOKE },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] }, grep: CORE },
  ],
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
