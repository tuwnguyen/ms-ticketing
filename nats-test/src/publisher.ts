import nats from "node-nats-streaming";
import { Publisher } from "./events/base-publisher";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS ");
  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({
    id: "123",
    title: "sdasdas",
    price: 10,
  });
});
