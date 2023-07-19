const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv=require("dotenv");
// const multer = require('multer');
// const sharp = require('sharp');
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const JSZip = require('jszip');


dotenv.config()

app.use(bodyParser.urlencoded({ extended:true }));
app.use(cors());
app.use(express.json());



app.use('/backend/api/user',require('./Router/UserRouter'))




mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server running ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("there is error");
    console.error(err);
  });
