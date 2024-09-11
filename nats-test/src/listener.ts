import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";
console.clear();

const clientID = randomBytes(4).toString("hex");
const stan = nats.connect("ticketing", clientID, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Event Listened");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// INTERRUPT SIGNAL
process.on("SIGINT", () => stan.close());

// TERMINATE SIGNAL
process.on("SIGTERM", () => stan.close());
