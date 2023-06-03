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
    TotalAmountCopy:TotalAmount,
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

// pay

// const pay = async (req, res) => {
//   const userId = req.params.id;
//   console.log(userId);
//   const amount = req.body.CollectionAmount
//   const user=await User.findById(userId)
//   console.log(user);
//   const {CollectionAmount,TotalAmount}=user
//   console.log("collection",CollectionAmount);
//   console.log("amount",amount);
//   try {
//     console.log("tryyyyy");

//     //   amount=2000<5000

//       if (amount < CollectionAmount) {
//         const remaining=CollectionAmount-amount
//         console.log("remaining",remaining);
//         toto.push(blace)
//         console.log("totot",toto);
//         await User.findByIdAndUpdate(userId, { $push: { Pending:remaining,Collected:amount} })
//           res.status(200).json("Amount is pending")

// // 5000==5000&& 500>amount
//       } else {
//           await User.findByIdAndUpdate(userId, { $push: { Collected: amount } })
//           res.status(200).json("Paid")

//       }
//   } catch {
//       console.log(error)
//       res.status(500).json(error)
//   }

// }

// const pay = async (req, res) => {
//   const userId = req.params.id;
//   console.log(userId);
//   const amount = req.body.CollectionAmount;
//   const user = await User.findById(userId);
//   console.log(user);
//   const { CollectionAmount, TotalAmount } = user;
//   console.log("collection", CollectionAmount);
//   console.log("amount", amount);
//   try {
//     console.log("tryyyyy");
//     const remaining = CollectionAmount - amount;
//     console.log("remaining", remaining);

//     const toto = [];
//     if (amount < CollectionAmount) {

//       if (remaining >= 0) {
//         toto=(TotalAmount - remaining);
//         await User.findByIdAndUpdate(userId, {
//           $push: { Pending: toto, Collected: amount },
//         });
//         console.log("totot", toto);
//         res.status(200).json("Amount is pending");
//       } else {
//         res.status(400).json("Invalid amount");
//       }
//     } else {

//       await User.findByIdAndUpdate(userId, {
//         $push: { Collected: amount },
//       });
//       res.status(200).json("Paid");
//     }
//     console.log("array",toto);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// const pay = async (req, res) => {
//   const userId = req.params.id;
//   const amount = req.body.CollectionAmount;

//   try {
//     const user = await User.findById(userId);
//     const { CollectionAmount, Collected, TotalAmount, TotalAmountHistory } =user;

//     // const currentDate = new Date();


//     const updatedTotalAmount = TotalAmount - amount;
    
//     const updatedTotalAmountHistory = [
//       ...TotalAmountHistory,
//       updatedTotalAmount,
//     ];
//     if (amount < CollectionAmount) {
//       const remaining = CollectionAmount - amount;

//       console.log("updatedTotalAmountHistory", updatedTotalAmountHistory);

//       // Update the user document
//       await User.findByIdAndUpdate(userId, {
//         $push: {
//           Pending: remaining,
//           Collected: amount,
//         },
//         // Tamount: updatedTotalAmount,
//         TotalAmountHistory: updatedTotalAmountHistory,
//       });

//       res.status(200).json("Amount is pending");
//     } else {
//       await User.findByIdAndUpdate(userId, {
//         $push: {
//           Collected: amount,
//         },
//         Tamount: updatedTotalAmount,
//         TotalAmountHistory: updatedTotalAmountHistory,
//       });
//       res.status(200).json("Paid");
//     }
//     console.log("aaaaaaaaaaaaa", TotalAmountHistory);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

// const pay = async (req, res) => {
//   const userId = req.params.id;
//   const amount = req.body.CollectionAmount;

//   try {
//       const user = await User.findById(userId);
//       const { CollectionAmount, Collected,TotalAmountCopy,TotalAmountHistory ,TotalAmount} = user;

//       const currentDate = new Date();
//       console.log(TotalAmountCopy,"copppyyyyyy");

//     // const TAmount=[...TotalAmountCopy,]

//     // console.log(TAmount,"tamut");
//     // const updatedTotalAmountHistory = [...TotalAmountHistory,TAmount];
//     //  await User.findByIdAndUpdate(userId, {
//     //   $push: {
//     //     TotalAmountHistory:TotalAmount
        
//     //   }
//     // })
   
         

//       let updatedTotalAmount = TotalAmountCopy - amount;

//       if (updatedTotalAmount < 0) {
//           updatedTotalAmount = 0;
//       }



//       // Push the updatedTotalAmount to the TotalAmountHistory array
//        const updatedTotalAmountHistory = [...TotalAmountHistory, updatedTotalAmount];


//       if (amount < CollectionAmount) {
//           const remaining = CollectionAmount - amount; 

//           console.log('updatedTotalAmount', updatedTotalAmount);
//           console.log('updatedTotalAmountHistory', updatedTotalAmountHistory);

//           // Update the user document
//           await User.findByIdAndUpdate(userId, {
//               $push: {
//                   Pending: {
//                       date: currentDate,
//                       amount: remaining
//                   },
//                   Collected: {
//                       date: currentDate,
//                       amount: amount
//                   }
//               },
//               TotalAmountCopy: updatedTotalAmount,
//               TotalAmountHistory: updatedTotalAmountHistory
//           });

//           res.status(200).json('Amount is pending');
//       } else {
//           console.log('updatedTotalAmount', updatedTotalAmount);
//           console.log('updatedTotalAmountHistory', updatedTotalAmountHistory);

//           // Update the user document
//           await User.findByIdAndUpdate(userId, {
//               $push: {
//                   Collected: {
//                       date: currentDate,
//                       amount: amount
//                   }
//               },
//               TotalAmountCopy: TotalAmount,
//               TotalAmountHistory: updatedTotalAmountHistory
//           });

//           res.status(200).json('Paid');
//       }

//   } catch (error) {
//       console.log(error);
//       res.status(500).json(error);
// }
// };

const pay = async (req, res) => {
  const userId = req.params.id;
  const amount = req.body.CollectionAmount;

  try {
    const user = await User.findById(userId);
    const { CollectionAmount, Collected, TotalAmountCopy, TotalAmountHistory, TotalAmount } = user;

    const currentDate = new Date();

    let updatedTotalAmount = TotalAmountCopy - amount;

    if (updatedTotalAmount < 0) {
      updatedTotalAmount = 0;
    }

    // Push the updatedTotalAmount and the current TotalAmount to the TotalAmountHistory array
    const updatedTotalAmountHistory = [...TotalAmountHistory, updatedTotalAmount ];

    if (amount < CollectionAmount) {
      const remaining = CollectionAmount - amount;

      console.log('updatedTotalAmount', updatedTotalAmount);
      console.log('updatedTotalAmountHistory', updatedTotalAmountHistory);

      // Update the user document
      await User.findByIdAndUpdate(userId, {
        $push: {
          Pending: {
            date: currentDate,
            amount: remaining
          },
          Collected: {
            date: currentDate,
            amount: amount
          }
        },
        TotalAmountCopy: updatedTotalAmount,
        TotalAmountHistory:  updatedTotalAmountHistory
      });

      res.status(200).json('Amount is pending');
    } else {
      console.log('updatedTotalAmount', updatedTotalAmount);
      console.log('updatedTotalAmountHistory', updatedTotalAmountHistory);

      // Update the user document
      await User.findByIdAndUpdate(userId, {
        $push: {
          Collected: {
            date: currentDate,
            amount: amount
          }
        },
        TotalAmountCopy: TotalAmount,
        TotalAmountHistory: updatedTotalAmountHistory
      });

      res.status(200).json('Paid');
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
