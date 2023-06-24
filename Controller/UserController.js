const User = require("../Model/UserModel");
const Transaction = require("../Model/otpVerify");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const date = require("date-and-time");
const Admin = require("../Model/AdminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    // filtering todaydates, who only have pending as state

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


const transactionPay = async (req, res) => {
  // const amount = req.body.amount;
  // const userId = req.params.id;
  const{userId,amount} = req.body
  console.log(amount,userId),"jjjjjj";

  try {
    const user = await User.findById(userId);
    let { TotalPendingAmount, TotalCollected,InterestPercentage,TotalAmountCopy,TotalAmountHistory,TotalAmount,TotalProfit } = user
    console.log(TotalPendingAmount,"TotalPendingAmount",TotalCollected);

    
    const currentDate = new Date();
    
    let updatedTotalAmount = TotalAmountCopy -amount;
    console.log(typeof updatedTotalAmount,"typeeeeeeeee of updated");
    
    
    if (updatedTotalAmount < 0) {
      res
      .status(401)
      .json({ "money more than remaining amount": TotalAmountCopy });
      
      console.log("no moneyyy bhaiiii");
    } else {
      console.log("iffffffffffffffffffff=====>");
      TotalAmountHistory.push((updatedTotalAmount));

      
    
    


    
    // if (amount < TotalPendingAmount) {
    //   console.log("amount is less than TotalPendingAmount");
    //   TotalPendingAmount = parseInt(TotalPendingAmount) - parseInt(amount);
    //   user.Pending.pendingAmount= parseInt(user.Pending.pendingAmount)-amount
    //   console.log(user.Pending.pendingAmount,"........");
    //   await user.save();
    // } else {
    //   TotalPendingAmount = 0;
      
    //   for (const pendingEntry of user.Pending) {
    //     if (pendingEntry.date.toDateString() === currentDate.toDateString()) {
          
    //       pendingEntry.state = "Collected";
    //       pendingEntry.pendingAmount="0"
    //     }

    //   }

    // }

    if (amount < TotalPendingAmount) {
      console.log("amount is less than TotalPendingAmount");
      TotalPendingAmount = parseInt(TotalPendingAmount) - parseInt(amount);
      user.Pending.forEach(pendingEntry => {
        if (pendingEntry.date.toDateString() === currentDate.toDateString()) {
          pendingEntry.state = "Collected";
          pendingEntry.pendingAmount -= amount;
        }
      });
      await user.save();
    } else {
      TotalPendingAmount = 0;
      user.Pending.forEach(pendingEntry => {
        if (pendingEntry.date.toDateString() === currentDate.toDateString()) {
          pendingEntry.state = "Collected";
          pendingEntry.pendingAmount = 0;
        }
      });
    }
    

    const profit = amount * (InterestPercentage / 100);
    console.log(profit,"profit");

    TotalCollected=TotalAmount-updatedTotalAmount

    // TotalCollected = parseInt(TotalCollected) + parseInt(amount);
    console.log(TotalCollected);
    TotalProfit = (parseInt(TotalCollected) * parseFloat(user.InterestPercentage)) / 100;
    console.log(TotalProfit);

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
      TotalCollected:TotalCollected,
      TotalPendingAmount,
      TotalProfit    });

console.log(TotalProfit,TotalCollected, user.InterestPercentage);

    await user.save();


    // Return the updated user or appropriate response
    res.json("send");
    }
  } catch (error) {
    // Handle error
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// const Signup = async (req, res) => {
//   try {
//   const { Username, Password, confirmPassword,Name } = req.body;
//   console.log("rreqq", req.body);
//     const hashedPassword = await bcrypt.hash(req.body.Password, 10);
//     console.log(hashedPassword,"hashedPassword");
//     const admin = Admin({
//       Username: Username,
//       Password: hashedPassword,
//       Name: name,

//     });
//     console.log("admin", admin);
//    const a= await admin.save()

//    console.log(a,"a");
//    req.session.Username=req.body.Username;
//     res.status(200).json(admin);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json("Signup Failed");
//   }
// };




// const Login = async (req, res, next) => {
//   const { Username, Password } = req.body;

//   const admin = await Admin.findOne({ Username: Username });
  
//   if (!admin) {
//     return res.status(401).send('Invalid username or password');
//   }
  
//   const validPassword = await bcrypt.compare(Password, admin.Password);

//   if (validPassword) {
//     // req.session.Username = admin.Username;
//     res.send('Login successful');
//   }
//   else {
//    console.log('invalid', 'invalid username or password');
//   }

// }

const Signup = async (req, res) => {
  try {
    const { email, password, confirmPassword,name,mobile } = req.body;
  console.log("rreqq", req.body);

    // const oldUser = await Admin.findOne({ mobile:mobile })
    // console.log("old", oldUser);
    // if (oldUser) {
    //   return res.status(400).json({ message: "Username  already exist" })
    // }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword,"hashedPassword");
    const admin = Admin({
      email: email,
      password: hashedPassword,
      mobile:mobile,
      name: name,

    });
    console.log("admin====>", admin);
    const newAdmin=await admin.save()
    console.log("Password",newAdmin);
    res.status(200).json({ status:"ok"});
  } catch (error) {
    console.log(error);
    res.status(500).json("Signup Failed");
  }
};




const Login = async (req, res, next) => {
  const { name, password,mobile } = req.body;
  console.log(req.body,"qqqqqqqqqqqqqqqqqq");

  const admin = await Admin.findOne({ mobile: mobile });
  if (admin) {
    const validPassword = await bcrypt.compare(password, admin.password);

    console.log("validPassword", validPassword);
  if (validPassword) {
    console.log("innnnn");
    // req.session.Username = admin.Username;
    // console.log("session", req.session.Username);

    const token = jwt.sign({

      mobile: admin.mobile, id: admin._id
    }, 
    "secret123", { expiresIn: '1h' })

    console.log(token);
    res.status(200).json({ admin, token })

  }
  else {
   console.log('invalid', 'invalid username or password');
}

}
}


// delete customer

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json('customer deleted');
  } catch (error) {
    res.status(500).json(error);
  }
};

//update customer

const updateUser = async (req, res) => {
  const id = req.body.id;
  console.log("reqqqq",req.body);
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


const Logout = (req, res) => {
  try {
    req.session.destroy()
    console.log("logout");
  } catch (error) {
    console.log(error.message)

 }
}


module.exports = {
  addUser,
  allUsers,
  collectionList,
  pay,
  transactionPay,
  Login,
  Signup,
  deleteUser,
  updateUser,
  Logout
};





//search user
// export const searchUser = async (req, res) => {
//   try {
//     const keyword = req.query.name || "";
//     const users = await UserModel.find({
//       $or: [
//         { username: { $regex: keyword, $options: "i" } },
//         { firstname: { $regex: keyword, $options: "i" } },
//         { lastname: { $regex: keyword, $options: "i" } },
//       ],
//     }).select({ username: 1, firstname: 1, lastname: 1, profilePicture: 1 });
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(404).json({err,message:'Not found'});
//     console.log(err);
//   }
// };



// import React from "react";
// import "./Search.css";
// import { Link } from "react-router-dom";
// import useSearchUsers from "../../hooks/useSearchUsers";
// const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

// const Search = ({ searchKey }) => {
//   const { users, loading, error } = useSearchUsers(searchKey);
//   return (
//     users.length > 0 && (
//       <div className="search-result">
//         {users?.map((user) => (
//           <div key={user._id} className="search-items">
//             <img
//               src={
//                 user?.profilePicture
//                   ? serverPublic + user.profilePicture
//                   : serverPublic + "defaultProfile.png"
//               }
//               alt=""
//             />
//             <div className="search-name">
//               <span>
//                 <Link to={`/profile/${user._id}`}>
//                   {user.firstname} {user.lastname}
//                 </Link>
//               </span>
//               <span>
//                 <Link to={`/profile/${user._id}`}>{user.username}</Link>
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     )
//   );
// };

// export default Search;


// import React from "react";
// import Logo from "../../img/logo.png";
// import { UilSearch } from "@iconscout/react-unicons";
// import "./LogoSearch.css";
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import Search from "../Search/Search";

// const LogoSearch = () => {
  
//   const [searchKey, setSearchKey] = useState("");
//   return (
//     <div className="LogoSearch">
//       <Link to="/home">
//         <img src={Logo} alt="" />
//       </Link>
//       <div className="Search">
//         <input
//           type="text"
//           placeholder="Search"
//           onChange={(e) => setSearchKey(e.target.value)}
//         />
//         <div className="s-icon">
//           <UilSearch />
//         </div>
//         {searchKey.trim().length > 0 && <Search searchKey={searchKey} />}
//       </div>
//     </div>
//   );
// };

// export default LogoSearch;