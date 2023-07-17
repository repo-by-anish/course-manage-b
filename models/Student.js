const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    select:false,
    required: true
  },
  studentId: {
    type: String,
    unique: true,
  },
  coursesEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required:true,
      onDelete: 'CASCADE'
    },
  ],
  active:{
    type:Boolean,
    default:true
  },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
