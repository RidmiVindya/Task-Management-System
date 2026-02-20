import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Validate MongoDB URI format
if (!MONGODB_URI.startsWith("mongodb://") && !MONGODB_URI.startsWith("mongodb+srv://")) {
  throw new Error(
    "MONGODB_URI must start with 'mongodb://' or 'mongodb+srv://'"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB database
 * Uses singleton pattern to reuse connections
 */
async function connectDB(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch((err) => {
      // Provide more helpful error message for common connection issues
      if (err?.message?.includes('ENOTFOUND') || err?.message?.includes('querySrv')) {
        const helpfulError = new Error(
          `MongoDB connection failed: Invalid connection string or cluster not found. ` +
          `Please verify your MONGODB_URI in .env.local. ` +
          `The connection string should start with 'mongodb+srv://' and include your cluster hostname. ` +
          `Original error: ${err.message}`
        );
        helpfulError.name = err.name;
        throw helpfulError;
      }
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
