const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let addressSchema = new Schema(
  {
    road: { type: String },
    area: { type: String },
  },
  { _id: false }
);

let phoneSchema = new Schema(
  {
    type: { type: String, trim: true },
    number: { type: String, trim: true },
  },
  { _id: false }
);

let productSchema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    product: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    quantity: { type: Number, min: 1 },
    cost: { type: Number, min: 0 },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minlength: 3,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 5,
      maxlength: 100,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 50,
    },
    surname: {
      type: String,
      required: [true, "Surname is required"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email address is not valid",
      ],
    },
    address: addressSchema,
    phone: { type: [phoneSchema], default: [] },
    roles: { type: [String], default: ["READER"] },
    products: { type: [productSchema], default: [] },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
