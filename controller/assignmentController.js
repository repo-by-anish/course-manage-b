const path = require('path');
const fs = require("fs")
const multer = require('multer');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

// Multer Configuration
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const { courseId, semester } = req.body;
        const foundCourse=await Course.findById(courseId)
        let courseName;
        if (foundCourse) {
             courseName=foundCourse.title;
        }else{
            return;
        }
        const uploadDir = path.join(__dirname, '..', 'static', 'assignments', courseName, semester);
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

const getAllAssignments = async (req, res) => {
    const assignments = await Assignment.find().populate("assignedBy").populate("courseId");
    if (!assignments.length) {
        return res.status(400).json({ message: "No assignment found" });
    }
    res.json(assignments);
};


const createAssignment = async (req, res) => {
    const { assignedBy, courseId, duration, semester, title, detail } = req.body;

    if (!assignedBy || !courseId || !duration || !semester || !req.file || !title || !detail) {
        return res.status(400).json({ message: 'All fields are required' });
    }


    const assignment = new Assignment({
        assignedBy,
        courseId,
        duration,
        semester,
        title,
        detail,
        assignmentFile: req.file.path,
    });

    assignment.save()
        .then(() => {
            res.status(201).json({ message: 'Assignment created successfully' });
        })
        .catch(() => {
            res.status(400).json({ message: 'Failed to create assignment' });
        });
};

const updateAssignment = async (req, res) => {
    const { id, assignedBy, courseId, duration, semester, title, detail } = req.body;

    if (!id || !assignedBy || !courseId || !duration || !semester || !title || !detail) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    Assignment.findById(id)
        .then((assignment) => {
            if (!assignment) {
                return res.status(404).json({ message: 'Assignment not found' });
            }

            assignment.assignedBy = assignedBy;
            assignment.courseId = courseId;
            assignment.duration = duration;
            assignment.semester = semester;
            assignment.title = title;
            assignment.detail = detail;

            assignment.save()
                .then(() => {
                    res.json({ message: 'Assignment updated successfully' });
                })
                .catch(() => {
                    res.status(400).json({ message: 'Failed to update assignment' });
                });
        })
        .catch(() => {
            res.status(400).json({ message: 'Failed to update assignment' });
        });
};


const deleteAssignment = async (req, res) => {
    const { id } = req.body;
  
    if (!id) {
      return res.status(400).json({ message: 'Id is not provided' });
    }
  
    try {
      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
  
      // Delete the assignment file
      const filePath = assignment.assignmentFile
      fs.unlinkSync(filePath);
      await assignment.deleteOne();
      res.status(204).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.log(error);
      res.status(400).json({ message: 'Failed to delete assignment' });
    }
  };

module.exports = {
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAllAssignments,
    upload,
};
