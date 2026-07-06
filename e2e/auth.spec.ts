import { test, expect, type Page } from '@playwright/test';

// Default UI language is Marathi; assertions accept mr OR en text.
// Dev mode surfaces the OTP as "…OTP: 123456" — we read it from the page.

async function fillLogin(page: Page, phone: string) {
  await page.fill('#bk-phone', phone);
  await page.click('#bk-phone ~ button');
  await expect(page.locator('#bk-otp')).toBeVisible();
  const hint = await page.getByText(/OTP:\s*\d{6}/).first().textContent();
  const otp = hint?.match(/\d{6}/)?.[0];
  expect(otp, 'dev OTP should be visible').toBeTruthy();
  await page.fill('#bk-otp', otp!);
  await page.click('#bk-otp ~ button');
}

test('phone-OTP happy path lands on /account with the session', async ({ page }) => {
  await page.goto('/signin');
  await fillLogin(page, '9700000001');
  await expect(page).toHaveURL(/\/account/);
  await expect(page.locator('body')).toContainText('+919700000001');
});

test('a wrong OTP keeps the user on /signin with an error', async ({ page }) => {
  await page.goto('/signin');
  await page.fill('#bk-phone', '9700000002');
  await page.click('#bk-phone ~ button');
  await expect(page.locator('#bk-otp')).toBeVisible();
  const real = (await page.getByText(/OTP:\s*\d{6}/).first().textContent())!.match(/\d{6}/)![0];
  const wrong = real === '000000' ? '111111' : '000000';
  await page.fill('#bk-otp', wrong);
  await page.click('#bk-otp ~ button');
  await expect(page).toHaveURL(/\/signin/);
  await expect(page.locator('body')).toContainText(/Incorrect|चुक/);
});

test('logout then login again works', async ({ page }) => {
  await page.goto('/signin');
  await fillLogin(page, '9700000003');
  await expect(page).toHaveURL(/\/account/);
  await page.getByRole('button', { name: /Sign out|साइन आउट/ }).click();
  await expect(page).toHaveURL(/localhost:3000\/?$/);
  // Successful login clears the OTP cooldown, so the same number can re-login.
  await page.goto('/signin');
  await fillLogin(page, '9700000003');
  await expect(page).toHaveURL(/\/account/);
});

test('protected /account redirects to /signin when logged out', async ({ page, context }) => {
  await context.clearCookies();
  await page.goto('/account');
  await expect(page).toHaveURL(/\/signin/);
});

test('SECURITY: open-redirect via callbackUrl is neutralised', async ({ page }) => {
  await page.goto('/signin?callbackUrl=https://example.com/evil');
  await fillLogin(page, '9700000005');
  // Must land on the internal fallback, never the external host.
  await expect(page).toHaveURL(/localhost:3000\/account/);
  expect(page.url()).not.toContain('example.com');
});

test('SECURITY: /admin is denied to a non-admin member', async ({ page }) => {
  await page.goto('/signin');
  await fillLogin(page, '9700000006');
  await expect(page).toHaveURL(/\/account/);
  // A logged-in member has role "member", not "admin" → authorized() returns false.
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/signin/);
});
