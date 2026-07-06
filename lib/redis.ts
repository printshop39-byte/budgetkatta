// lib/redis.ts — tiny KV abstraction over Upstash Redis with an in-memory
// fallback (dev / single instance). Used by OTP storage and the Redis rate
// limiter. Values are stored PREFIXED so the Upstash client never mis-parses a
// stored hash as JSON.
import { Redis } from '@upstash/redis';

let upstash: Redis | null = null;

function client(): Redis | null {
  if (upstash) return upstash;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  upstash = new Redis({ url, token });
  return upstash;
}

export function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

// ── in-memory fallback ──────────────────────────────────
// Pinned to globalThis so it's a single shared store across route-handler
// module instances in Next dev (same pattern as lib/mongodb.ts's conn cache).
// Production uses Upstash (shared by nature), so this only affects local dev.
const globalForKv = globalThis as unknown as {
  __bkKvMem?: Map<string, { value: string; expiresAt: number }>;
};
const mem = globalForKv.__bkKvMem ?? (globalForKv.__bkKvMem = new Map());

function memGet(key: string): string | null {
  const e = mem.get(key);
  if (!e) return null;
  if (Date.now() > e.expiresAt) {
    mem.delete(key);
    return null;
  }
  return e.value;
}

// ── public KV API (all values are strings) ──────────────
export async function kvSet(key: string, value: string, ttlSec: number): Promise<void> {
  const c = client();
  if (c) {
    await c.set(key, value, { ex: ttlSec });
    return;
  }
  mem.set(key, { value, expiresAt: Date.now() + ttlSec * 1000 });
}

export async function kvGet(key: string): Promise<string | null> {
  const c = client();
  if (c) {
    const v = await c.get<string>(key);
    return v == null ? null : String(v);
  }
  return memGet(key);
}

export async function kvDel(key: string): Promise<void> {
  const c = client();
  if (c) {
    await c.del(key);
    return;
  }
  mem.delete(key);
}

/** Increment a counter; set the TTL only when the window first opens. */
export async function kvIncr(key: string, ttlSec: number): Promise<number> {
  const c = client();
  if (c) {
    const n = await c.incr(key);
    if (n === 1) await c.expire(key, ttlSec);
    return n;
  }
  const existing = mem.get(key);
  const alive = existing && Date.now() < existing.expiresAt;
  const next = (alive ? Number(existing!.value) : 0) + 1;
  const expiresAt = alive ? existing!.expiresAt : Date.now() + ttlSec * 1000;
  mem.set(key, { value: String(next), expiresAt });
  return next;
}

/** Test helper — clears the in-memory store (no-op against Upstash). */
export function __clearMemoryStore(): void {
  mem.clear();
}
