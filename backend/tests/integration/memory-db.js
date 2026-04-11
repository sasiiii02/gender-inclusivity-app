import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer;

export async function connectMemoryDb() {
  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoServer.getUri());
  }
}

export async function clearAllCollections() {
  if (!mongoose.connection.db) return;
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
}

export async function disconnectMemoryDb() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch {
    /* ignore */
  }
  if (mongoServer) {
    const m = mongoServer;
    mongoServer = undefined;
    // Avoid awaiting stop() — it can hang on Windows; child exits with the test process.
    m.stop().catch(() => {});
  }
}
