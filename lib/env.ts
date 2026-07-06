// lib/env.ts — validate the environment required for a safe PRODUCTION boot.
// Run via `npm run check:env` in CI/pre-deploy. In dev, everything is optional
// (graceful fallbacks), so validation is a no-op unless NODE_ENV === production.

export interface EnvIssue {
  key: string;
  message: string;
}

type Env = Record<string, string | undefined>;

export function validateProductionEnv(env: Env = process.env): EnvIssue[] {
  const issues: EnvIssue[] = [];
  if (env.NODE_ENV !== 'production') return issues; // only enforced in production

  const need = (key: string, message: string) => {
    if (!env[key]) issues.push({ key, message });
  };

  need('AUTH_SECRET', 'session signing secret is required (openssl rand -base64 32)');
  need('MONGODB_URI', 'database connection is required to persist users');
  need('UPSTASH_REDIS_REST_URL', 'shared OTP/rate-limit store required (in-memory is dev-only)');
  need('UPSTASH_REDIS_REST_TOKEN', 'Upstash REST token is required');

  // At least one sign-in method must be usable in production.
  const hasGoogle = Boolean(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET);
  const hasOtpSms = Boolean(env.MSG91_AUTH_KEY && env.MSG91_OTP_TEMPLATE_ID);
  if (!hasGoogle && !hasOtpSms) {
    issues.push({
      key: 'AUTH_PROVIDERS',
      message: 'configure Google OAuth and/or MSG91 OTP so users can actually sign in',
    });
  }
  return issues;
}

export function assertProductionEnv(env: Env = process.env): void {
  const issues = validateProductionEnv(env);
  if (issues.length > 0) {
    throw new Error(
      'Invalid production environment:\n' + issues.map((i) => ` - ${i.key}: ${i.message}`).join('\n')
    );
  }
}
