const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  instructors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    onDelete: 'CASCADE'
  }],

  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      onDelete: 'CASCADE'
    },
  ],
  syllabus:{
    type:String,
    require:true
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
