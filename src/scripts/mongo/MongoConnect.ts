import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

// Tipli connection objesi
const connection: { isConnected?: number } = {};

async function MongoConnect() {
  if (connection.isConnected) return;

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  return mongoose
    .connect(MONGODB_URI, {
      dbName: "runtime",
    })
    .then((r) => {
      connection.isConnected = r.connections[0].readyState;
      console.log("Connected to Mongoose Successfully");
    })
    .catch((err) => console.log(err));
}

export default MongoConnect;
