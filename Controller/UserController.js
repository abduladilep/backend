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
    // console.log("users", users);
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
          // console.log(updatedDatesForUser, "updatedDatesFor");

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
            pendingAmount: CollectionAmount,
            userId: userId,
            state: "Pending",
          },
        },
      };
      if (
        !user.Pending.some(
          (item) => item.date.toDateString() === date.toDateString()
        )
      ) {
        await User.updateOne({ _id: userId }, updateQuery);

        // Calculate the total sum of pending amounts
				const updatedUser = await User.findById(userId); // Fetch the updated user
				const totalPendingAmount = updatedUser.Pending.reduce((sum, item) => {
					console.log(item,"item");
					return sum + parseInt(item.pendingAmount);
				}, 0);

				// Save the updated user with the totalPendingAmount
				updatedUser.TotalPendingAmount = totalPendingAmount;
				await updatedUser.save();
				console.log("Total pending amount:", totalPendingAmount);

      }
    }

    //filtering todaydates, who only have pending as state

    const filteredTodayDates = todayDates.filter((dateObj) => {
			const { userId } = dateObj;

			// Check if user.Pending is "Pending"
			const user = users.find((user) => user.id === userId);
			const isPending = user.Pending.some((item) => item.state === 'Pending');
			return isPending;
		});



 
    res.status(201).json({
      allWeeks: allWeeks,
      todayDates: filteredTodayDates,
    });
  } catch (error) {
    console.log(error);
  }
};

const pay = async (req, res) => {
  //  const userId= req.params.id
  //  const amount= req.body.CollectionAmount
  const userId = req.body.userId;
  const amount = req.body.amount;
  // const {userId, amount} =req.body;

  try {
    const user = await User.findById(userId);
    const {
      CollectionAmount,
      Collected,
      Pending,
      TotalAmountCopy,
      TotalAmountHistory,
      TotalAmount,
      InterestPercentage,
      TotalPendingAmount,
    } = user;

    const currentDate = new Date();

    let updatedTotalAmount = TotalAmountCopy -amount;
    console.log(typeof updatedTotalAmount,"typeeeeeeeee of updated");


    const pendingcalc = TotalPendingAmount-amount

		user.TotalPendingAmount = pendingcalc

    console.log("TotalPendingAmount",pendingcalc);


    if (updatedTotalAmount < 0) {
      res
        .status(401)
        .json({ "money more than remaining amount": TotalAmountCopy });

      console.log("no moneyyy bhaiiii");
    } else {
      console.log("iffffffffffffffffffff=====>");
      TotalAmountHistory.push((updatedTotalAmount));



      if (parseInt(amount) < parseInt(CollectionAmount)) {
        console.log("its if condin=tion");
        const remaining = CollectionAmount - amount;

        // Update the user document
        const pendingEntry = await user.Pending.find(
          (item) => item.date.toDateString() === currentDate.toDateString()
        );

        if (!pendingEntry) {
          // Add a new entry for the current date
          user.Pending.push({
            date: currentDate,
            pendingAmount: remaining,
            userId,
            state: "Pending",
          });
        } else {
          // Update the existing entry for the current date
          pendingEntry.pendingAmount = remaining;
          pendingEntry.state = "PartialPayment";

        }

        //pushing collected amount

        await user.Collected.push({
          date: currentDate,
          amount:amount,
          userId:userId,
          state: "Collected",
        });

        // calculate today profit and  pushing into array
        const profit = amount * (InterestPercentage / 100);

        await User.findByIdAndUpdate(userId, {
          $push: {
            TodayProfit: {
              date: currentDate,
              Profit: profit,
            },
          },
        });

        //calculating total Collected of user

        user.TotalCollected = TotalAmount - updatedTotalAmount;

        //update TotalAmountCopy(remining)

        user.TotalAmountCopy = parseInt(updatedTotalAmount);

        
        await user.save();

        res.status(200).json("Amount is pending");
      } else {
        console.log("its else condition");
        // calculate today profit

        const profit = amount * (InterestPercentage / 100);

        // pushing collected amount and todyProfit

        await User.findByIdAndUpdate(userId, {
          $push: {
            Collected: {
              date: currentDate,
              amount: amount,
              userId: userId,
              state: "Collected",
            },
            TodayProfit: {
              date: currentDate,
              Profit: profit,
            },
          },
          TotalAmountCopy: updatedTotalAmount,
        });
             
        //updating state as collected in pending array and  update pending amount

        for (const pendingEntry of user.Pending) {
					if (pendingEntry.date.toDateString() === currentDate.toDateString()) {
						pendingEntry.state = "Collected";
            pendingEntry.pendingAmount="0"
					}

				}


     // Calculating Total Collected Amount and pushing
        user.TotalCollected = TotalAmount - updatedTotalAmount;

        res.status(200).json("Paid");
      }


      //Calculate the Total Profit Of User

      user.TotalProfit = (user.TotalCollected * user.InterestPercentage) / 100;
      await user.save();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//pending                                     
// const pendingList = async (req, res) => {
// 	try {
// 		const users = await User.find();

// 		const pendingUsers = users.filter(user => {
// 			const pending = user.Pending[0]; // Access the first element of the array
// 			return (
// 				pending &&
// 				pending.state === "Pending"|| pending.state === "PartialPayment" &&
// 				pending.amount > 0
// 			);
// 		});

// 		res.status(200).json({ users: pendingUsers });
// 	} catch (error) {
// 		res.status(500).json({ error: 'Internal server error' });
// 	}
// };



module.exports = {
  addUser,
  allUsers,
  collectionList,
  pay,
};
