import express from 'express';
import mongoose from 'mongoose'
// https://www.npmjs.com/package/express-async-errors
// Error handling async error
import 'express-async-errors'
import { json } from 'body-parser';

import { currentUserRouter } from './router/current-user'
import { signinRouter } from './router/signin'
import { signoutRouter } from './router/signout'
import { signupRouter } from './router/signup'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error';


const app = express();
app.use(json());

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async() => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error(error)
  }

  app.listen(3000, () => {
    console.log('listening on port 3000!!!');
  });
}

start()

