const express = require('express');
const router = express.Router();
const userController=require('../Controller/UserController')

router.post('/signup',userController.Signup)
router.get('/login',userController.Login)
router.post('/addUser',userController.addUser)
router.get('/allUsers',userController.allUsers)
// router.get('/pendingList',userController.pendingList)

router.get('/collectionList',userController.collectionList)
router.post('/pay',userController.pay)
router.post('/transactionPay',userController.transactionPay)
router.delete('/deleteUser/:id',userController.deleteUser)
router.post('/updateUser',userController.updateUser)


module.exports=router
