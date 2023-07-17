const express = require("express");
const router = express.Router();
const courseController = require("../controller/courseController");

router.route("/")
  .get(courseController.getAllCourses)
  .post(courseController.upload.single("file"),courseController.createCourse)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);

module.exports = router;