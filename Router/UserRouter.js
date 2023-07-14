const express = require('express');
const router = express.Router();
const {Signup,Login,addUser,allUsers,collectionList,pay,transactionPay,deleteUser,updateUser, adminDetails, adminDelete} = require('../Controller/UserController');
const {sendOTPVerificationEmail,otpVerify}=require('../Controller/otpController')
const {validateUserToken}=require('../Middleware/jwtAuth')

router.post('/signup',Signup)
router.post('/otpsend',sendOTPVerificationEmail);
router.post('/verifyotp', otpVerify);
router.post('/login',Login)


router.post('/addUser',validateUserToken,addUser)
router.get('/allUsers',allUsers)
// router.get('/pendingList',userController.pendingList)

router.get('/collectionList',collectionList)
router.post('/pay',validateUserToken,pay)
router.post('/transactionPay',validateUserToken,transactionPay)
router.delete('/deleteUser',deleteUser)
router.post('/updateUser',updateUser)
router.get('/adminDetails', adminDetails)
router.delete('/adminDelete',adminDelete)



module.exports=router
