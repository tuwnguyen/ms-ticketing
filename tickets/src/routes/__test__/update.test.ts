import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

const createTicket = (cookie = global.signin()) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdasd", price: 10 });
};

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "sdsd", price: 10 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "sdsd", price: 10 })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await createTicket();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "qweqwe", price: 10 })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "sdsdsds",
      price: -20,
    })
    .expect(400);
});

it("update the ticket provided valid inputs", async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 40,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(40);
});

it("publishes an event", async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 40,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it.only("rejects updates if the ticket is reserved", async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);

  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 40,
    })
    .expect(400);
});
