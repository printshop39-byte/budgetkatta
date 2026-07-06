import { request } from '@playwright/test';

// Warm the dev server's lazily-compiled routes BEFORE the first test, so tests
// (especially on the slower WebKit engine) aren't racing a ~30s cold compile.
export default async function globalSetup() {
  const ctx = await request.newContext({ baseURL: 'http://localhost:3000' });
  try {
    // Wait for the server, then compile the routes the tests exercise.
    for (let i = 0; i < 30; i++) {
      try {
        const r = await ctx.get('/signin');
        if (r.ok()) break;
      } catch {
        /* server not up yet */
      }
      await new Promise((res) => setTimeout(res, 2000));
    }
    await ctx.get('/account'); // compiles the (app) group + middleware
    await ctx.get('/admin');
    await ctx.get('/api/auth/csrf');
    await ctx.post('/api/auth/otp', {
      data: { phone: '9000000000' },
      headers: { origin: 'http://localhost:3000' },
    });
  } catch {
    // best-effort warm-up — ignore failures
  } finally {
    await ctx.dispose();
  }
}
