const User = require("../Model/UserModel");
const Transaction = require("../Model/TransactionModel");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const date = require("date-and-time");

// Add customer

const addUser = async (req, res) => {
  const {
    Name,
    MobileNo,
    Address,
    GivenAmount,
    TotalAmount,
    CollectionAmount,
    IdProof,
    Photo,
    InterestAmount,
    InterestPercentage,
    collectionDate,
    collectionPeriod,
    collectionEndDate,
  } = req.body;
  console.log(req.body, "reqBody");

  const newUser = new User({
    Name,
    MobileNo,
    Address,
    GivenAmount,
    TotalAmount,
    TotalAmountCopy: TotalAmount,
    CollectionAmount,
    IdProof,
    Photo,
    InterestAmount,
    InterestPercentage,
    collectionDate,
    collectionPeriod,
    collectionEndDate,
  });

  try {
    console.log("bdshdsh");

    await newUser.save();
    res.status(201).json(newUser);
    console.log(newUser, "saved");
  } catch (error) {
    res.status(500).json(error);
  }
};

//fetching the users list

const allUsers = async (req, res) => {
  try {
    let users = await User.find();
    res.status(200).json(users);
    console.log("users", users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// const collectionList = async (req, res) => {
//   try {
//     const users = await User.find();
//     const allWeeks=[]

//     const updatedDates = users.map((user) => {
//       const { collectionDate, collectionEndDate,id } = user;
//       console.log(id,"uuuu");
//       const updatedDatesForUser = [];
//       const today = new Date();
//       for (let date = new Date(collectionDate); date <= new Date(collectionEndDate); date.setDate(date.getDate() + 1)) {
//         if ((date - new Date(collectionDate)) % (7 * 24 * 60 * 60 * 1000) === 0) {
//           const updatedDate = new Date(date);

//           allWeeks.push(updatedDate);

//           if (updatedDate.toDateString() === today.toDateString()) {
//            console.log(allWeeks,"upupup");
//            updatedDatesForUser.push(updatedDate);

//           }
//         }
//         // res.status(201).json(allWeeks);
//       }
//       console.log("updated dates for user: " , updatedDatesForUser);
//       return updatedDatesForUser;
//     });

//     const todayDates = updatedDates.filter((dates) => dates.some((date) => date.toDateString() === new Date().toDateString()));
//     console.log("todayyateeee",todayDates);
//     res.status(201).json({ allWeeks: allWeeks,
//       todayDates:todayDates});

//   } catch (error) {
//     console.log(error);
//   }
// };

const collectionList = async (req, res) => {
  try {
    const users = await User.find();
    const allWeeks = [];

    users.forEach((user) => {
      const {
        collectionDate,
        collectionEndDate,
        id,
        TotalAmount,
        CollectionAmount,
        TotalAmountCopy,
        Name,
      } = user;
      console.log(id, "uuuu");
      console.log("amount", collectionDate);
      console.log("name", Name);

      // let main=TotalAmount;
      // let reducing=TotalAmount-CollectionAmount;
      // main=reducing
      // console.log("main",main);

      const updatedDatesForUser = [];
      const today = new Date();

      for (
        let date = new Date(collectionDate);
        date <= new Date(collectionEndDate);
        date.setDate(date.getDate() + 1)
      ) {
        if (
          (date - new Date(collectionDate)) % (7 * 24 * 60 * 60 * 1000) ===
          0
        ) {
          const updatedDate = new Date(date);
          updatedDatesForUser.push(updatedDate);

          // if (updatedDate.toDateString() === today.toDateString()) {
          //   console.log(updatedDatesForUser, "upupup");
          // }
        }
      }

      allWeeks.push({
        // user: user,
        userId: id,
        dates: updatedDatesForUser,
      });

      console.log("updated dates for user:", updatedDatesForUser);
    });

    // const todayDates = allWeeks.filter((user) => user.dates.some((date) => date.toDateString() === new Date().toDateString())).map((user) => user.Name);

    const todayUsers = allWeeks.filter((user) =>
      user.dates.some(
        (date) => date.toDateString() === new Date().toDateString()
      )
    );

    const todayDates = todayUsers.map((user) => ({
      date: user.dates.find(
        (date) => date.toDateString() === new Date().toDateString()
      ),
      userId: user.userId,
    }));

    console.log("todayDates:", todayDates);

    res.status(201).json({
      allWeeks: allWeeks,
      todayDates: todayDates,
    });
  } catch (error) {
    console.log(error);
  }
};

const pay = async (req, res) => {
  const userId = req.params.id;
  const amount = req.body.CollectionAmount;

  try {
    const user = await User.findById(userId);
    const {
      CollectionAmount,
      Collected,
      Pending,
      TotalAmountCopy,
      TotalAmountHistory,
      TotalAmount,
    } = user;

    const currentDate = new Date();

    let updatedTotalAmount = TotalAmountCopy - amount;

    console.log("TotalAmountCopy",TotalAmountCopy);

    if (!TotalAmountHistory.includes(TotalAmount)) {
      TotalAmountHistory.push(TotalAmount);
      console.log("bh");
    }

    if (updatedTotalAmount < 0 ) {

      res.status(401).json({"money morethan remaing amount"  :TotalAmountCopy});

      console.log("no moneyyy bahiiii");
    } else {
      TotalAmountHistory.push(updatedTotalAmount);

      if (amount < CollectionAmount) {
        const remaining = CollectionAmount - amount;

        // Update the user document

        await User.findByIdAndUpdate(userId, {
          $push: {
            Pending: {
              date: currentDate,
              amount: remaining,
            },
            Collected: {
              date: currentDate,
              amount: amount,
            },
          },
          TotalAmountCopy: updatedTotalAmount,
          TotalAmountHistory: TotalAmountHistory,
        });

        res.status(200).json("Amount is pending");
        console.log("updatedTotalAmount", updatedTotalAmount);
        console.log("TotalAmountHistory", TotalAmountHistory);
        console.log("pedning amount updated", Pending);
        console.log("collected amount updated", Collected);
      } else {
        // Update the user document
        await User.findByIdAndUpdate(userId, {
          $push: {
            Collected: {
              date: currentDate,
              amount: amount,
            },
          },
          TotalAmountCopy: updatedTotalAmount,
          TotalAmountHistory: TotalAmountHistory,
        });

        res.status(200).json("Paid");

        console.log("updatedTotalAmount", updatedTotalAmount);
        console.log("TotalAmountHistory", TotalAmountHistory);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  addUser,
  allUsers,
  collectionList,
  pay,
};
