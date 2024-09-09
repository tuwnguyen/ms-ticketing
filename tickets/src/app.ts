import express from "express";
// https://www.npmjs.com/package/express-async-errors
// Error handling async error
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@tuwtickets/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // making a request to our server over an HTTPS connection
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
