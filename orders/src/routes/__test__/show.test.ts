import request from "supertest";
import { Ticket } from "../../models/ticket";
import { app } from "../../app";

it("fetches the order", async () => {
  const ticket = Ticket.build({ title: "concert", price: 10 });
  await ticket.save();
  const user1 = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket.id })
    .expect(201);
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user1)
    .expect(200);
  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another users order ", async () => {
  const ticket = Ticket.build({ title: "concert", price: 10 });
  await ticket.save();
  const user1 = global.signin();
  const user2 = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .expect(401);
});
