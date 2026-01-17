const mongoose = require("mongoose");

async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }
  await mongoose.connect(uri);
}

module.exports = connectDb;

