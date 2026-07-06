// lib/userService.ts — upsert/link the app User for both auth providers.
// Uses the JWT session strategy (no DB adapter), so we own the User record.
// Dev fallback: when Mongo isn't configured, returns a synthetic user with a
// stable id so the full sign-in → session flow is testable without a database.
import { createHash } from 'crypto';
import { connectDB, isMongoConfigured } from '@/lib/mongodb';
import { User } from '@/models/User';

export interface AppUser {
  _id: string;
  phone?: string;
  email?: string;
  googleId?: string;
  displayName?: string | null;
  image?: string | null;
  roles: string[];
  locale: string;
}

function devId(seed: string): string {
  return 'dev:' + createHash('sha1').update(seed).digest('hex').slice(0, 16);
}

// `u` is a loosely-typed Mongoose document (or our dev-fallback object).
function toApp(u: any): AppUser {
  return {
    _id: String(u._id),
    phone: u.phone,
    email: u.email,
    googleId: u.googleId,
    displayName: u.displayName ?? null,
    image: u.image ?? null,
    // Coerce to a PLAIN string array — a Mongoose array can't be structuredClone'd
    // into the JWT (causes DataCloneError during session encode).
    roles: Array.isArray(u.roles) && u.roles.length ? Array.from(u.roles, String) : ['member'],
    locale: u.locale ?? 'mr',
  };
}

export async function upsertUserByPhone(phone: string): Promise<AppUser> {
  if (!isMongoConfigured()) {
    return { _id: devId('phone:' + phone), phone, roles: ['member'], locale: 'mr', displayName: null };
  }
  await connectDB();
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone, phoneVerifiedAt: new Date(), roles: ['member'] });
  } else {
    user.phoneVerifiedAt = user.phoneVerifiedAt ?? new Date();
    user.lastActiveAt = new Date();
    await user.save();
  }
  return toApp(user);
}

export async function upsertUserByGoogle(p: {
  googleId: string;
  email?: string;
  name?: string;
  image?: string;
}): Promise<AppUser> {
  if (!isMongoConfigured()) {
    return {
      _id: devId('google:' + p.googleId),
      googleId: p.googleId,
      email: p.email,
      displayName: p.name ?? null,
      image: p.image ?? null,
      roles: ['member'],
      locale: 'mr',
    };
  }
  await connectDB();
  const or: Record<string, string>[] = [{ googleId: p.googleId }];
  if (p.email) or.push({ email: p.email.toLowerCase() });
  let user = await User.findOne({ $or: or });
  if (!user) {
    user = await User.create({
      googleId: p.googleId,
      email: p.email?.toLowerCase(),
      displayName: p.name,
      image: p.image,
      roles: ['member'],
    });
  } else {
    // Link Google to an existing (e.g. phone-created) account, filling gaps only.
    if (!user.googleId) user.googleId = p.googleId;
    if (!user.email && p.email) user.email = p.email.toLowerCase();
    if (!user.displayName && p.name) user.displayName = p.name;
    if (!user.image && p.image) user.image = p.image;
    user.lastActiveAt = new Date();
    await user.save();
  }
  return toApp(user);
}
