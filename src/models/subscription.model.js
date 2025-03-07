import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // one who is subscribing
      ref: "User", //Think of ObjectId like a phone number and ref: "User" like a contact list.
    },
    channel: {
      type: Schema.Types.ObjectId, // one who is being subscribed
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
