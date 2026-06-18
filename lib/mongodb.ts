// lib/mongodb.ts — cached MongoDB connection for serverless + scripts

import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

/** True when a connection string is configured. */
export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectDB(): Promise<typeof mongoose> {
  // Read the env lazily (inside the function) so dotenv-loaded scripts and
  // serverless cold starts both see the value at call time.
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }
  // Validate the scheme up front so a malformed value (wrapping quotes, missing
  // prefix, stray whitespace) produces a clear message instead of a raw
  // MongoParseError stack. Never log the URI itself — it holds credentials.
  if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
    throw new Error('MONGODB_URI is malformed. It must start with mongodb:// or mongodb+srv://');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // Connection pooling tuned for serverless: a small reused pool per warm
    // instance, fail fast if Atlas is unreachable.
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
