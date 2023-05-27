const { Timestamp, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Transaction = mongoose.Schema(
    {
    transactionId: {
        type: String,
        required: true,
      },
      dateTime: {
        type: Date,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
  },
  { Timestamp: true }
);

module.exports = mongoose.model("transaction", Transaction);
