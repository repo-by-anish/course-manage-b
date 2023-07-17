const Student = require("../models/Student");
const Course = require("../models/Course");
const bcrypt = require('bcrypt');

const getAllStudents = async (req, res) => {
    const students = await Student.find().lean().populate("coursesEnrolled");
    if (!students?.length) {
        return res.status(400).json({ message: "No students found" });
    } else {
        res.json(students);
    }
};

const createStudent = async (req, res) => {
    const { firstName, lastName, email, password, studentId, coursesEnrolled } = req.body;
    if (!firstName || !lastName || !email || !password || !coursesEnrolled.length) {
        return res.status(401).json({ message: "All fields are required" });
    }

    const duplicate = await Student.findOne({ studentId });
    if (duplicate) {
        return res.status(409).json({ message: "StudentId already in use" });
    }

    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const student = await Student.create({
        firstName,
        lastName,
        email,
        password:hashedPwd,
        studentId,
        coursesEnrolled,
    });

    if (student) {
        for (const courseId of coursesEnrolled) {
            const courseToUpdate = await Course.findById(courseId);
            if (courseToUpdate) {
                courseToUpdate.studentsEnrolled.push(student._id);
                await courseToUpdate.save();
            }
        }
        return res.status(201).json({ message: "Student created" });
    } else {
        return res.status(400).json({ message: "Invalid student data received" });
    }
};

const updateStudent = async (req, res) => {
    const { id, firstName, lastName, email, password, studentId } = req.body;
    if (!id || !firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const student = await Student.findById(id);
    if (!student) {
        return res.status(400).json({ message: "Student not found" });
    }
    const duplicate = await Student.findOne({ email }).lean().exec();
    if (duplicate && duplicate._id.toString !== id) {
        return res.status(409).json({ message: "Duplicate student found" });
    }
    student.firstName = firstName;
    student.lastName = lastName;
    student.email = email;
    student.password = password;
    student.studentId = studentId;

    const updatedStudent = await student.save();
    res.json({ message: `${updatedStudent.firstName} updated` });
};

const deleteStudent = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Id is not provided" });
    }
    const student = await Student.findById(id);
    if (!student) {
        return res.status(401).json({ message: "Student not found" });
    }
    const stResult = await student.deleteOne();
    if (stResult) {
        return res.status(204).json({ message: "Student deleted" });
    }
};

module.exports = {
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
};
