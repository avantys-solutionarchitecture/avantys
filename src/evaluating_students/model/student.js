const mongoose = require("../db");
const Class = require("./class").classSchema;
const Module = require("./module").moduleSchema;
const Study = require("./study").studySchema;

const Schema = mongoose.Schema;
const studentSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: false
  },
  modules: {
    type: [Module],
    required: false,
    default: []
  },
  study: {
    type: Study,
    required: false
  }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = {
  Student,
  studentSchema
};
