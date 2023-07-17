const mongoose = require('mongoose');

const principalSchema = new mongoose.Schema({
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
    required: true,
    select: false
  },
  department: {
    type: String,
    required: true,
  },
  active:{
    type:Boolean,
    default:true
  },
});

const Principal = mongoose.model('Principal', principalSchema);

module.exports = Principal;
