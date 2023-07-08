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



app.use('/api/user',require('./Router/UserRouter'))


// app.post('/api/convert', upload.array('images'), async (req, res) => {
//   try {
//     const convertedFiles = [];
//     console.log("popodowlodd");

//     // Loop through each uploaded file
//     for (const file of req.files) {
//       console.log("popopooooooooooooooo");
//       // Convert the file to the desired format (e.g., JPEG)
//       const convertedBuffer = await sharp(file.buffer).jpeg().toBuffer();
      
//       // Generate a unique filename for the converted file
//       const convertedFilename = `${file.originalname.split('.')[0]}.jpg`;

//       // Add the converted file to the array
//       convertedFiles.push({ filename: convertedFilename, buffer: convertedBuffer });
//     }

//     // Set the response headers for file download
//     res.set('Content-Type', 'application/zip');
//     res.set('Content-Disposition', 'attachment; filename=converted_images.zip');

//     // Create a zip file containing the converted files and send it to the client
//     const zip = new JSZip();
//     for (const file of convertedFiles) {
//       zip.file(file.filename, file.buffer);
//     }
//     const zipBlob = await zip.generateAsync({ type: 'nodebuffer' });
//     res.send(zipBlob);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred during image conversion');
//   }
// });



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
