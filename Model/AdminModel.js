const { Timestamp, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Admin = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // unique: true
    },
    mobile:{
      type: String,
      required: true,
      unique: true
    },
  
    email: {
      type: String,
      required: true,
      // unique: true
    },
    password: {
      type: String,
      required: true,
      // unique: true
    },
  },
  { Timestamp: true }
);

module.exports = mongoose.model("Admin",Admin)