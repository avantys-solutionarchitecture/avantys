const mongoose = require("../db");
const TestResult = require("./testresult").testResultSchema;

const Schema = mongoose.Schema;
const moduleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  testResults: {
    type: [TestResult],
    required: false,
    default: []
  }
});

const Module = mongoose.model("Module", moduleSchema);

module.exports = {
  Module,
  moduleSchema
};
