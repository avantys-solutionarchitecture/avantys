const Teacher = require("../model/teacher").Teacher;
const sendToQueue = require("../config/rabbitmq").connectAndSend;

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<*>}
 */
const getTeachers = async (req, res, next) =>
  await Teacher.find()
    .then(teachers =>
      teachers ? res.status(200).json(teachers) : res.status(200).json([])
    )
    .catch(next);

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<*>}
 */
const getTeacher = async ({ params: { id } }, res, next) =>
  await Teacher.findById(id)
    .then(teacher => (teacher ? res.status(200).json(teacher) : res.end(404)))
    .catch(next);

module.exports = {
  getTeachers,
  getTeacher
};