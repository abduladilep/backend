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
        Address,
        Name,
        MobileNo,
      } = user;

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
          console.log(updatedDatesForUser, "updatedDatesFor");

          // if (updatedDate.toDateString() === today.toDateString()) {
          //   console.log(updatedDatesForUser, "upupup");
          // }
        }
      }

      allWeeks.push({
        userId: id,
        Name: Name,
        dates: updatedDatesForUser,
        CollectionAmount: CollectionAmount,
        Address: Address,
        MobileNo: MobileNo,
      });
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
      Name: user.Name,
      CollectionAmount: user.CollectionAmount,
      Address: user.Address,
      MobileNo: user.MobileNo,
    }));

    for (const dateObj of todayDates) {
      const { userId, date } = dateObj;
      const user = await User.findById(userId);

      const CollectionAmount = user.CollectionAmount;

      const updateQuery = {
        $push: {
          Pending: {
            date: date,
            amount: CollectionAmount,
            userId: userId,
          },
        },
      };
      if ( !user.Pending.some(
          (item) => item.date.toDateString() === date.toDateString()
        )
      ) {
        await User.updateOne({ _id: userId }, updateQuery);
      }
    }+

    console.log("todayDates:", todayDates);

    res.status(201).json({
      allWeeks: allWeeks,
      todayDates: todayDates,
    });
  } catch (error) {
    console.log(error);
  }
};

// const pay = async (req, res) => {
//   // const userId = req.params.id;
//   // const amount = req.body.CollectionAmount;
//   const {userId, amount} =req.body;

//   console.log(amount,"frontend amount");
//   console.log(userId,"frontend amount");

//   try {
//     const user = await User.findById(userId);
//     const{
//       CollectionAmount,
//       Collected,
//       Pending,
//       TotalAmountCopy,
//       TotalAmountHistory,
//       TotalAmount,
//     } = user;

//     const currentDate = new Date();

//     let updatedTotalAmount = TotalAmountCopy - amount;

//     console.log("TotalAmountCopy", TotalAmountCopy);

//     if (!TotalAmountHistory.includes(TotalAmount)) {
//       TotalAmountHistory.push(TotalAmount);
//       console.log("bh");
//     }

//     if (updatedTotalAmount < 0) {
//       res.status(405).json("money morethan remaing amount" );
//       console.log("no moneyyy bahiiii");
//     } else {
//       TotalAmountHistory.push(updatedTotalAmount);




//       if (amount < CollectionAmount) {
//         const remaining = CollectionAmount - amount;

//         // Update the user document
//         const pendingEntry =  await user.Pending.find(
//           (item) => item.date.toDateString() === currentDate.toDateString()
//         );


//         if (!pendingEntry) {
//           // Add a new entry for the current date
//           user.Pending.push({ date: currentDate, amount: remaining, userId });
//         } else {
//           // Update the existing entry for the current date
//           pendingEntry.amount = remaining;
//         }

//         // await User.findByIdAndUpdate(userId, {
//         //   $push: {
//         //     // Pending: {
//         //     //   date: currentDate,
//         //     //   amount: remaining,
//         //     //   userId: userId,
//         //     // },
//         //     Collected: {
//         //       date: currentDate,
//         //       amount: amount,
//         //       userId: userId,
//         //     },
//         //   },
//         //   TotalAmountCopy: updatedTotalAmount,
//         //   TotalAmountHistory: TotalAmountHistory,
//         // });
//         await user.Collected.push({ date: currentDate, amount, userId });
//         user.TotalAmountCopy = updatedTotalAmount;
//         await user.save();
  

//         res.status(200).json("Amount is pending");
//         console.log("updatedTotalAmount", updatedTotalAmount);
//         console.log("TotalAmountHistory", TotalAmountHistory);
//         console.log("pedning amount updated", Pending);
//         console.log("collected amount updated", Collected);
//       } else {
//         // Update the user document
// const currenDate=new Date()


//         await User.findByIdAndUpdate(userId, {

//           $pull: { pending: { date: currenDate } },

//           $push: {
//             Collected: {
//               date: currentDate,
//               amount: amount,
//               userId: userId,
//             },
//           },
        
//           TotalAmountCopy: updatedTotalAmount,
//           TotalAmountHistory: TotalAmountHistory,
//         });

//         res.status(200).json("Paid");

//         console.log("updatedTotalAmount", updatedTotalAmount);
//         console.log("TotalAmountHistory", TotalAmountHistory);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

const pay = async (req, res) => {
  // const userId = req.params.id;
  // const amount = req.body.CollectionAmount;
    const {userId, amount} =req.body;
  
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
  
    console.log("TotalAmountCopy", TotalAmountCopy);
  
    if (!TotalAmountHistory.includes(TotalAmount)) {
      TotalAmountHistory.push(TotalAmount);
      console.log("bh");
    }
  
    if (updatedTotalAmount < 0) {
      res.status(401).json({ "money more than remaining amount": TotalAmountCopy });
  
      console.log("no moneyyy bhaiiii");
    } else {
      TotalAmountHistory.push(updatedTotalAmount);
  
      if (amount < CollectionAmount) {
        const remaining = CollectionAmount - amount;
  
        // Update the user document
        const pendingEntry = await user.Pending.find(
          (item) => item.date.toDateString() === currentDate.toDateString()
        );
  
        if (!pendingEntry) {
          // Add a new entry for the current date
          user.Pending.push({ date: currentDate, amount: remaining, userId, state: "pending" });
        } else {
          // Update the existing entry for the current date
          pendingEntry.amount = remaining;
        }
        
        await user.Collected.push({ date: currentDate, amount, userId, state: "Pending" });
        user.TotalAmountCopy = updatedTotalAmount;
  
        // Calculate the total sum of pending amounts with status "pending"
        //   console.log("item",item);
        // const totalPendingAmount = user.Pending.reduce((sum, item) => {
        //   if (item.state === "Pending") {
        //     console.log("pending", item.amount);
        //     return sum + item.amount;
        //   }
        //   return sum;
        // }, 0);
  
        // console.log("Total pending amount:", totalPendingAmount);
        // user.totalPendingAmount = totalPendingAmount;
  
        await user.save();
  
        res.status(200).json("Amount is pending");
      } else {
        await User.findByIdAndUpdate(userId, {
          $push: {
            Collected: {
              date: currentDate,
              amount: amount,
              userId: userId,
              state: "Collected",
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
  
  //pending                                     
  const pendingList = async (req, res) => {
    try {
      const users = await User.find();
  
      const pendingUsers = users.filter(user => {
        const pending = user.Pending[0]; // Access the first element of the array
        console.log(pending.amount,"pending.state",pending.state);
        return (
          pending &&
          pending.state === "Pending" &&
          pending.amount > 0
        );
      });
  
      res.status(200).json({ users: pendingUsers });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  

module.exports = {
  addUser,
  allUsers,
  collectionList,
  pay,
  pendingList
};
