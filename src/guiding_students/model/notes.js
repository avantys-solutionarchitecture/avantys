const mongoose = require("../config/db");
const Schema = mongoose.Schema;
const Student = require("./student").studentSchema;
const Teacher = require("./teacher").teacherSchema;

const notesSchema = new Schema({
  student: {
    type: Student,
    required: true
  },
  teacher: {
    type: Teacher,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  date: {
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    }
  }
});

notesSchema.pre('save', function (next) {
  if (!this.isNew) {
      this.date.modified = Date.now();
  }

  next();
});

const Notes = mongoose.model("Notes", notesSchema);

module.exports = {
  Notes,
  notesSchema,
};
