const { Timestamp, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const User = mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      // unique: true
    },
    MobileNo: {
      type: Number,
      required: true,
      // unique: true
    },
    Address: {
      type: String,
      // required: true,
      trim: true,
    },
    collectionDate: {
      type: Date,
      required: true,
    },
    GivenAmount: {
      type: String,
      required: true,
    },
    InterestAmount: {
      type: String,
      required: true,
    },
    TotalAmount: {
      type: String,
      required: true,
    },
    TotalAmountCopy: {
      type: String,
      // required: true,
    },
    collectionPeriod: {
      type: String,
      required: true,
    },
    CollectionAmount: {
      type: String,
      required: true,
    },
    InterestPercentage: {
      type: String,
      required: true,
    },
    collectionEndDate: {
      type: Date,
      // required: true,
    },
   
    IdProof: [ {
      type: String,
        url: String,
        filename: String,
      }],
    Photo: [
      {
        type: String,
        url: String,
        filename: String,
      },
    ],

    Pending: [
      {
        amount:{type:String},
        date:{type:Date,default:Date.now}
      },
    ],
    Collected: [
      {
        amount:{type:String},
        date:{type:Date,default:Date.now}
      },
    ],

    TotalAmountHistory: [
      {
        // amount:Number,
        // // date:{type:Date,default:Date.now}
        type: String, 
      },
    ],
   
  },
  { Timestamp: true }
);




module.exports = mongoose.model("User", User);
