const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    items: [
      new Schema(
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          product: {
            type: String,
            required: true,
          },
          image: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true,
            min: 0,
          },
        },
        { _id: false }
      ),
    ],
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      area: { type: String, required: true },
      road: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
