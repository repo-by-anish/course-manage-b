const express=require("express");
const router=express.Router();

const studentController=require("../controller/studentController")

router.route("/")
.get(studentController.getAllStudents)
.post(studentController.createStudent)
.patch(studentController.updateStudent)
.delete(studentController.deleteStudent)

module.exports=router