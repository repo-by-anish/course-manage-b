const path = require('path');
const fs = require("fs");
const multer = require('multer');
const Course = require('../models/Course');

// Multer Configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { title } = req.body;
    if(!title){
        return res.status(500).json({message:"Titel is not provided"})
    }
    const uploadDir = path.join(__dirname, '..', 'static', 'courses', title);
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

const getAllCourses = async (req, res) => {
  const course = await Course.find();
  if (!course.length) {
    return res.status(400).json({ message: "No course found" });
  }
  res.json(course);
};

const createCourse = async (req, res) => {
  const { title, description } = req.body;
    console.log(req.title);
  if (!req.file || !title || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const course = new Course({
    title,
    description,
    syllabus: req.file.path,
  });

  course.save()
    .then(() => {
      res.status(201).json({ message: 'Course created successfully' });
    })
    .catch(() => {
      res.status(400).json({ message: 'Failed to create course' });
    });
};

const updateCourse = async (req, res) => {
    try {
        const { id, title, description } = req.body;

        if (!id || !title || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        course.title = title;
        course.description = description;

        await course.save();

        res.json({ message: "Course updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Id is not provided" });
        }

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.studentsEnrolled.length !== 0) {
            return res.status(444).json({ message: "Students enrolled in this course" });
        }

        await course.deleteOne();

        res.status(204).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getAllCourses,
    createCourse, // Apply multer middleware to the createCourse route
    updateCourse,
    deleteCourse,
    upload
};
