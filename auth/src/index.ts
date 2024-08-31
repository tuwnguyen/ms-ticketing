import express from 'express';
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

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

app.listen(3000, () => {
  console.log('listening on port 3000!!!');
});
