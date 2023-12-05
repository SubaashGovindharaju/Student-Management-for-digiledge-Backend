import express from 'express';
import { AppUserModel } from '../db-utils/module.js';
const studentRouter = express.Router();
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';


// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Define the file name
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit (adjust as needed)
});

studentRouter.post("/upload", upload.single('Image'), async (req, res) => {
  const payload = req.body;
  console.log(req.body)
  const imagePath = req.file.path; // Get the file path after uploading
  console.log(req.file.path)
  try {
    const authuser = new AppUserModel({ ...payload, Image: imagePath });
    await authuser.save();
    res.send({ msg: 'user register successfully ' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: 'Error in creating' });
  }
});


studentRouter.get('/images', async (req, res) => {
  try {
    // Fetch all documents from the AppUserModel
    const images = await AppUserModel.find({}, { Name: 1, Gender: 1, Age: 1, Image: 1 ,_Id:1});

    // Send the images with binary data
    const imagesWithBinaryData = images.map((image) => {
      // Check if Image property exists in the document
      if (!image.Image) {
        console.error('Invalid image path:', image.Image);
        return null; // Skip this image
      }

      const imagePath = path.join( image.Image);

      // Check if imagePath is a valid string before proceeding
      if (typeof imagePath !== 'string') {
        console.error('Invalid image path:', imagePath);
        return null; // Skip this image
      }

      try {
        const imageData = fs.readFileSync(imagePath, 'base64');
        return { ...image.toObject(), Image: imageData };
      } catch (readError) {
        console.error('Error reading image file:', readError);
        return null; // Skip this image
      }
    }).filter(Boolean); // Remove null entries

    // Respond with the retrieved data
    res.status(200).json(imagesWithBinaryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




  studentRouter.get('/student/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
      const student = await AppUserModel.findById({_id:id}, { Name: 1, Gender: 1, Age: 1, Image: 1 });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      const imagePath = path.join(student.Image);
  
      // Check if imagePath is a valid string before proceeding
      if (typeof imagePath !== 'string') {
        console.error('Invalid image path:', imagePath);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      try {
        const imageData = fs.readFileSync(imagePath, 'base64');
        const studentWithBinaryData = { ...student.toObject(), Image: imageData };
        res.status(200).json(studentWithBinaryData);
        console.log(studentWithBinaryData)
      } catch (readError) {
        console.error('Error reading image file:', readError);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



  studentRouter.put("/edit/:id", upload.single('Image'), async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    console.log(payload)
    const imagePath = req.file ? req.file.path : undefined;
    console.log('Image Path:', imagePath);
    console.log('File Upload:', req.file);

    try {
      // Check if there's an image update
      if (imagePath) {
        // Remove the previous image file if it exists
        const student = await AppUserModel.findById(id);
        console.log('student', student.Image);
try{
        if (student && student.Image) {
          await fs.unlink(student.Image);
          console.log("done")
        }
      }
      catch{
        console.log("error")

      }
        // Update the student with the new image path
        await AppUserModel.findByIdAndUpdate(id, { ...payload, Image: imagePath });
      } else {
        // No image update, update other fields
        await AppUserModel.findByIdAndUpdate(id, payload);
      }
  
      res.send({ msg: 'Student updated successfully' });
    } catch (err) {

      // console.log(err);
      res.status(500).send({ msg: 'Error in updating student' });
    }
  });


  studentRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
  console.log(id)
    try {
      // Find the student by ID
      const student = await AppUserModel.findById(id);
      console.log(student.Image)

      // Check if the student exists
      if (!student) {
        return res.status(404).send({ msg: 'Student not found' });
      }
  
      // If the student has an associated image, remove it
      try{
      if (student.Image) {
        await fs.unlink(student.Image);
        console.log('done')

      }
    }catch{
      console.log('error')
    }
      // Delete the student from the database
      await AppUserModel.findByIdAndDelete(id);
  
      res.send({ msg: 'Student deleted successfully' });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ msg: 'Error in deleting student' });
    }
  });


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads');
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' + Date.now());
//     },
//   });

//   const upload = multer({ storage: storage });

//   studentRouter.get('/', (req, res) => {
//     imgSchema
//       .find({})
//       .then((data, err) => {
//         if (err) {
//           console.log(err);
//         }
//         res.render('imagepage', { items: data });
//       });
//   });
  
//   studentRouter.post('/upload', upload.single('image'), (req, res) => {
//     const obj = {
//       name: req.body.name,
//       desc: req.body.desc,
//       img: {
//         data: fs.readFileSync(path.join(__dirname, '/uploads/', req.file.filename)),
//         contentType: 'image/png',
//       },
//     };
  
//     imgSchema.create(obj)
//       .then((err, item) => {
//         if (err) {
//           console.log(err);
//         } else {
//           res.redirect('/');
//         }
//       });
//   });
  

// studentRouter.post('/upload', handleImageUpload, async (req, res) => {
//     const { Name, Gender, Age } = req.body;
//     const imageBuffer = req.file.buffer;
  
//     const newUser = new AppUserModel({
//       Name,
//       Gender,
//       Age,
//       Image: {
//         data: imageBuffer,
//         contentType: req.file.mimetype,
//       },
//     });
  
//     try {
//       await newUser.save();
//       res.status(201).json({ message: 'User created successfully.' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });
  
//   // Assuming you have AppUserModel imported
//     studentRouter.get('/student', async (req, res) => {
//     try {
//       const students = await AppUserModel.find();
//       res.status(200).json(students);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });

//   studentRouter.put('/:id', async (req, res) => {
//     const studentId = req.params.id;
//     const { id, Name, Gender, Age } = req.body;
  
//     try {
//       const updatedStudent = await AppUserModel.findByIdAndUpdate(
//         studentId,
//         {
//           id,
//           Name,
//           Gender,
//           Age,
//         },
//         { new: true } // Return the updated document
//       );
  
//       if (!updatedStudent) {
//         return res.status(404).json({ message: 'Student not found' });
//       }
  
//       res.status(200).json(updatedStudent);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });
  
//   studentRouter.delete('/:id', async (req, res) => {
//     const studentId = req.params.id;
  
//     try {
//       const deletedStudent = await AppUserModel.findByIdAndDelete(studentId);
      
//       if (!deletedStudent) {
//         return res.status(404).json({ message: 'Student not found' });
//       }
  
//       res.status(200).json({ message: 'Student deleted successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });
  

//   studentRouter.get('/:id', async (req, res) => {
//     const studentId = req.params.id;
  
//     try {
//       const student = await AppUserModel.findById(studentId);
      
//       if (!student) {
//         return res.status(404).json({ message: 'Student not found' });
//       }
  
//       res.status(200).json(student);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });
  
export default studentRouter;