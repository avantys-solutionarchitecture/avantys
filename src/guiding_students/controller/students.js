const Student = require("../model/student").Student;
const sendToQueue = require("../config/rabbitmq").connectAndSend;

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<*>}
 */
const getStudents = async (req, res, next) =>
  await Student.find()
    .then(students =>
      students ? res.status(200).json(students) : res.status(200).json([])
    )
    .catch(next);

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<*>}
 */
const getStudent = async ({ params: { id } }, res, next) =>
  await Student.findById(id)
    .then(student => (student ? res.status(200).json(student) : res.end(404)))
    .catch(next);

module.exports = {
  getStudents,
  getStudent
};