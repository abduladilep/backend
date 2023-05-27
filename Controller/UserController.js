const User = require("../Model/UserModel");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const date = require('date-and-time')

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
  console.log(req.body,"reqBody");
  
  const newUser = new User({
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
    
  } );

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
      console.log("users",users);
  } catch (error) {
      res.status(500).json(error);
}
};



// const collectionList=async(req,res)=>{
//   try{
//    const user=await User.find()
//    const {collectionDate,collectionEndDate,collectionPeriod}=user
//   console.log(collectionDate,"dateeeeeee");
// const value = date.addDays(collectionDate, 7);
// res.status(201).json(value); 


// console.log("updated date and time : " + value)



//   }catch(error){
// console.log(error);
//   }
// }

// const collectionList = async (req, res) => {
//   try {
//     const users = await User.find();
//     const updatedDates = users.map((user) => {
//       const { collectionDate } = user;
//       const updatedDate = new Date(collectionDate);
//       updatedDate.setDate(updatedDate.getDate() + 7);
//       console.log("updated date: " , updatedDate);
//       return updatedDate;
//     });
//     res.status(201).json(updatedDates);
//   } catch (error) {
//     console.log(error);
//   }
// };



// const collectionList = async (req, res) => {
//   try {
//     const users = await User.find();
//     const updatedDates = users.map((user) => {
//       const { collectionDate, collectionEndDate } = user;
//       const updatedDatesForUser = [];
//       for (let date = new Date(collectionDate); date <= new Date(collectionEndDate); date.setDate(date.getDate() + 1)) {
//         if ((date - new Date(collectionDate)) % (7 * 24 * 60 * 60 * 1000) === 0) {
//           updatedDatesForUser.push(new Date(date));
//         }
//       }
//       console.log("updated dates for user: " , updatedDatesForUser);
//       return updatedDatesForUser;
//     });
//     res.status(201).json(updatedDates);
//   } catch (error) {
//     console.log(error);
//   }
// };




// const collectionList = async (req, res) => {
//   try {
//     const users = await User.find();
//     const updatedDates = users.map((user) => {
//       const { collectionDate, collectionEndDate } = user;
//       const updatedDatesForUser = [];
//       const allWeeks=[]
//       const today = new Date();
//       for (let date = new Date(collectionDate); date <= new Date(collectionEndDate); date.setDate(date.getDate() + 1)) {
//         if ((date - new Date(collectionDate)) % (7 * 24 * 60 * 60 * 1000) === 0) {
//           const updatedDate = new Date(date);

//           allWeeks.push(updatedDate);
         
//          console.log(allWeeks,"upupup");
//          if (updatedDate.toDateString() === today.toDateString()) {
//            updatedDatesForUser.push(updatedDate);

//           }
//         }
//         // res.status(201).json(allWeeks);
//       }
//       console.log("updated dates for user: " , updatedDatesForUser);
//       return updatedDatesForUser;
//     });
//     const todayDates = updatedDates.filter((dates) => dates.some((date) => date.toDateString() === new Date().toDateString()));
//     res.status(201).json({todayDates});
    
//   } catch (error) {
//     console.log(error);
//   }
// };


// const collectionList = async (req, res) => {
//   try {
//     const users = await User.find();
//     const allWeeks=[]
//     const updatedDates = users.map((user) => {
//       const { collectionDate, collectionEndDate } = user;
//       const updatedDatesForUser = [];
//       const today = new Date();
//       for (let date = new Date(collectionDate); date <= new Date(collectionEndDate); date.setDate(date.getDate() + 1)) {
//         if ((date - new Date(collectionDate)) % (7 * 24 * 60 * 60 * 1000) === 0) {
//           const updatedDate = new Date(date);
//           allWeeks.push(updatedDate);
//           console.log(allWeeks,"upupup");
//           if (updatedDate.toDateString() === today.toDateString()) {
//             updatedDatesForUser.push(updatedDate);
//           }
//         }
//       }
//       console.log("updated dates for user: " , updatedDatesForUser);
//       return updatedDatesForUser;
//     });
    // if (updatedDatesForUser.length > 0) {
    //   return {
    //     user: {
    //       name: user.name,
    //       // add any other fields  you want to include
    //     },
    //     updatedDates: updatedDatesForUser,
    //   };
    // } else {
    //   return null;
    // }
  // });  
    // const todayDates = updatedDates.filter((dates) => dates.some((date) => date.toDateString() === new Date().toDateString()));
    // const usersWithTodayDates = todayDates.map((dates) => dates.filter((date) => date.toDateString() === new Date().toDateString())[0]);
    // const usersDetailsWithTodayDates = usersWithTodayDates.map((dates) => dates.user);
//     res.status(201).json({ allWeeks: allWeeks, todayDates });
//   } catch (error) {
//     console.log(error);
//   }
// };


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
      const { collectionDate, collectionEndDate, id,TotalAmount,CollectionAmount } = user;
      console.log(id, "uuuu");
      console.log("amount", TotalAmount);

      const updatedDatesForUser = [];
      const today = new Date();

      for (let date = new Date(collectionDate); date <= new Date(collectionEndDate); date.setDate(date.getDate() + 1)) {
        if ((date - new Date(collectionDate)) % (7 * 24 * 60 * 60 * 1000) === 0) {
          const updatedDate = new Date(date);
          updatedDatesForUser.push(updatedDate);

          if (updatedDate.toDateString() === today.toDateString()) {
            console.log(updatedDatesForUser, "upupup");
          }
        }
      }

      allWeeks.push({
        userId: id,
        dates: updatedDatesForUser
      });

      console.log("updated dates for user:", updatedDatesForUser);
    });

    const todayDates = allWeeks.filter((user) => user.dates.some((date) => date.toDateString() === new Date().toDateString())).map((user) => user.userId);
    ;
    console.log("todayDates:", todayDates);

    res.status(201).json({
      allWeeks: allWeeks,
      todayDates: todayDates
    });
  } catch (error) {
    console.log(error);
  }
};

// pay

const pay = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  const amount = req.body.CollectionAmount
  const user=await User.findById(userId) 
  console.log(user);
  const {CollectionAmount}=user
  console.log("collection",CollectionAmount);
  console.log("amount",amount);
  try {
    console.log("tryyyyy");
      if (amount < CollectionAmount) {
        const remaining=CollectionAmount-amount
        console.log(remaining);
        await User.findByIdAndUpdate(userId, { $push: { Pending:remaining,Collected:amount} })
          res.status(200).json("Amount is pending")
  
      } else {
          await User.findByIdAndUpdate(userId, { $push: { Collected: amount } })
          res.status(200).json("Paid")

      }
  } catch {
      console.log(error)
      res.status(500).json(error)
  }

}



module.exports = {
  addUser,
  allUsers,
  collectionList,
  pay
};
