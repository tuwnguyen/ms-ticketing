import nats from "node-nats-streaming";

console.clear();

const stan = nats.connect("ticketing", "123", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Event Listened");

  const subscription = stan.subscribe("ticket:created");
  subscription.on("message", () => {
    console.log(`Received message`);
  });
});
