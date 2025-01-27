import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tec:admin@arkxpense-db.jdwc7.mongodb.net/";

if (!MONGODB_URI) {
  throw new Error("Falta la variable de entorno MONGODB_URI");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("Mongo connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
