import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
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

  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe(
    "ticket:created",
    "order-service-queue-group",
    options
  );
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data ${data}}`);
    }
    msg.ack();
  });
});

// INTERRUPT SIGNAL
process.on("SIGINT", () => stan.close());

// TERMINATE SIGNAL
process.on("SIGTERM", () => stan.close());
