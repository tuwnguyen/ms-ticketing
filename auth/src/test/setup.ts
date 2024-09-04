import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { app } from '../app'
import request from 'supertest'

declare global {
  var signin: () => Promise<string[]>;
}

let mongod: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "asdasd"
  mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  await mongoose.connect(mongoUri);

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB Memory Server');
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
})

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@gmail.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({email, password})
    .expect(201)
  const cookie = response.get('Set-Cookie') as string[]
  return cookie
}