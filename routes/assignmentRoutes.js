const express = require('express');
const router = express.Router();
const assignmentController = require('../controller/assignmentController');

const verifyJWT = require("../middleware/verifyJWT")
router.use(verifyJWT)

router.get('/', assignmentController.getAllAssignments);
router.post('/', assignmentController.upload.single('file'), assignmentController.createAssignment);
router.patch('/', assignmentController.updateAssignment);
router.delete('/', assignmentController.deleteAssignment);

module.exports = router;
