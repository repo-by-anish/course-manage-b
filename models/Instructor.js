const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
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
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  expertise: {
    type: String,
    required: true,
  },
  coursesTaught: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      onDelete: 'CASCADE'
    },
  ],
  active: {
    type: Boolean,
    default: true
  }
});

const Instructor = mongoose.model('Instructor', instructorSchema);

module.exports = Instructor;
