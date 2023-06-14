const express = require('express');
const router = express.Router();
const userController=require('../Controller/UserController')


router.post('/addUser',userController.addUser)
router.get('/allUsers',userController.allUsers)
router.get('/pendingList',userController.pendingList)

router.get('/collectionList',userController.collectionList)
router.post('/pay',userController.pay)

module.exports=router
