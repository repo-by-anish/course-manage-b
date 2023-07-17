const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const bcrypt = require('bcrypt');

const getAllInstructors = async (req, res) => {
    const instructors = await Instructor.find()
        .populate("coursesTaught")
        .lean();
    if (!instructors.length) {
        return res.status(401).json({ message: "No instructor found" });
    }
    res.json(instructors);
};

const createInstructor = async (req, res) => {
    const { firstName, lastName, email, password, expertise, coursesTaught } = req.body;

    if (!firstName || !lastName || !email || !password || !expertise || !coursesTaught) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds
    console.log(coursesTaught);

    
    


    const instructor = await Instructor.create({
        firstName,
        lastName,
        email,
        password:hashedPwd,
        expertise,
        coursesTaught,
    });


    if (instructor) {
        for (const course of coursesTaught) {
            const { courseId } = course;
            const courseToUpdate = await Course.findById(courseId);

            if (courseToUpdate) {
                courseToUpdate.instructors.push({
                    instructor: instructor._id
                });
                await courseToUpdate.save();
            }
        }
        return res.status(201).json({ message: "Instructor created successfully" });

    } else {
        return res.status(400).json({ message: "Invalid instructor data received" });
    }
};

const updateInstructor = async (req, res) => {
    const { id, expertise, coursesTaught } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Id is required field" });
    }

    const instructor = await Instructor.findById(id);
    if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
    }

    if (expertise) {
        instructor.expertise = expertise;
    }
    if (coursesTaught) {
        instructor.coursesTaught = coursesTaught;
    }
    await instructor.save();

    res.json({ message: "Instructor updated successfully" });
};

const deleteInstructor = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Id is not provided" });
    }

    const instructor = await Instructor.findById(id);
    if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
    }

    await instructor.deleteOne();

    res.status(204).json({ message: "Instructor deleted successfully" });
};

module.exports = {
    getAllInstructors,
    createInstructor,
    updateInstructor,
    deleteInstructor,
};
