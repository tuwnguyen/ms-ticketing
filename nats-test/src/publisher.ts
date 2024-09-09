import nats from "node-nats-streaming";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  const data = JSON.stringify({
    id: "123",
    title: "sdasdas",
    price: 10,
  });

  stan.publish("ticket:created", data, () => {
    console.log("Event published");
  });
  console.log("Publisher connected to NATS ");
});
