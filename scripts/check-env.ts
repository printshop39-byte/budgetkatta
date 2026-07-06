// scripts/check-env.ts — pre-deploy production environment validation.
// Usage: NODE_ENV=production npm run check:env
import { assertProductionEnv } from '../lib/env';

try {
  assertProductionEnv();
  // eslint-disable-next-line no-console
  console.log('✓ production environment OK');
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(String(e instanceof Error ? e.message : e));
  process.exit(1);
}
