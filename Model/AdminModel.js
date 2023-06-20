const { Timestamp, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Admin = mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      // unique: true
    },
  
    Username: {
      type: String,
      required: true,
      unique: true
    },
    Password: {
      type: String,
      required: true,
      // unique: true
    },
  },
  { Timestamp: true }
);

module.exports = mongoose.model("Admin",Admin)