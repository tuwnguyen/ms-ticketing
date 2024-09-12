import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  title: string;
  price: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: string;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      require: true,
      type: String,
    },
    price: {
      require: true,
      type: Number,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function () {
  // Run query to look at all order. Find an order where the ticket is the ticket we just found *and* the order status is *not* cancelled.
  // If we find an order from that means the ticket is reserved.
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
