const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    detail: {
        type: String,
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    assignmentFile: {
        type: String,
        required: true,
    },
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
