import express from 'express';
// https://www.npmjs.com/package/express-async-errors
// Error handling async error
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@tuwtickets/common'

import { currentUserRouter } from './router/current-user'
import { signinRouter } from './router/signin'
import { signoutRouter } from './router/signout'
import { signupRouter } from './router/signup'


const app = express();
app.set('trust proxy', true);
app.use(
  cookieSession({
    signed: false,
    // making a request to our server over an HTTPS connection
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(json());

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }