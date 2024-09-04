import request from "supertest";
import { app } from '../../app'

it('responds with details about the current user', async () => {
  const authResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
      password: 'asdasdasd'
    })
    .expect(201)
  const cookie = authResponse.get('Set-Cookie')
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie as string[])
    .send()
    .expect(200)

  expect(response.body.currentUser.email).toEqual('test@gmail.com')
})