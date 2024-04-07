import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}
// save the connection in global, so that we don't have to connect to the database every time
let cached: MongooseConnection = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error("MONGODB_URL is not defined");

  cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
    dbName: "meimei",
    bufferCommands: false,
  });

  cached.conn = await cached.promise;

  return cached.conn;
}