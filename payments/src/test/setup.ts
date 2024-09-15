import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
declare global {
  var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper");

let mongod: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "asdasd";
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  await mongoose.connect(mongoUri);

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB Memory Server");
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db?.collections();
  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const sessionJSON = JSON.stringify({ jwt: token });

  // const base64 = btoa(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");

  const cookie = `session=${base64}`;

  return [cookie];
};
