const express = require('express');
const router = express.Router();
const userController=require('../Controller/UserController')


router.post('/addUser',userController.addUser)
router.get('/allUsers',userController.allUsers)
router.get('/collectionList',userController.collectionList)
router.post('/pay/:id',userController.pay)

module.exports=router
