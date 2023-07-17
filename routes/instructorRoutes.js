const express = require("express");
const router = express.Router();
const instructorController = require("../controller/instructorController");

router.route("/")
  .get(instructorController.getAllInstructors)
  .post(instructorController.createInstructor)
  .patch(instructorController.updateInstructor)
  .delete(instructorController.deleteInstructor);

module.exports = router;