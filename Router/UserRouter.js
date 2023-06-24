const express = require('express');
const router = express.Router();
const {Signup,Login,addUser,allUsers,collectionList,pay,transactionPay,deleteUser,updateUser} = require('../Controller/UserController');
const {sendOTPVerificationEmail,otpVerify}=require('../Controller/otpController')
const {validateUserToken}=require('../Middleware/jwtAuth')

router.post('/signup',Signup)
router.post('/otpsend',sendOTPVerificationEmail);
router.post('/verifyotp', otpVerify);
router.post('/login',Login)


router.post('/addUser',addUser)
router.get('/allUsers',allUsers)
// router.get('/pendingList',userController.pendingList)

router.get('/collectionList',collectionList)
router.post('/pay',pay)
router.post('/transactionPay',transactionPay)
router.delete('/deleteUser/:id',deleteUser)
router.post('/updateUser',updateUser)


module.exports=router
