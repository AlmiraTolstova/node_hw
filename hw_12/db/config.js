import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI || "uri";
const client = new MongoClient(uri);

let dbConnection = null;

async function connectToDatabase(params) {
  try {
    await client.connect();
    console.log("Connect successfully to Mongo DB");
    dbConnection = client.db();
  } catch (error) {
    console.error(
      "Failed to start the server doe to MongoDB connection issue",
      error,
    );
  }
}

function getDb() {
  if (!dbConnection) {
    throw new Error("Data base not  connected");
  }
  return dbConnection;
}

export { connectToDatabase, getDb };
