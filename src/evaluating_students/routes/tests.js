const express = require("express");
const router = express.Router();
const GradeModel = require("../model/grade").GradeModel;
const StudentModel = require("../model/student").StudentModel;
const TeacherModel = require("../model/teacher").TeacherModel;
const TestModel = require("../model/test").TestModel;
const rabbit = require("../rabbit/rabbot");

/**
 * @swagger
 *  paths:
 *      /tests:
 *         get:
 *           summary: Return list of all tests
 *           responses:
 *              '200':
 *                  description: "List of all tests"
 *              '500':
 *                  description: "Database query failed"
 *         put:
 *           summary: Not implemented.
 *           responses:
 *              '501':
 *                  description: "Not implemented"
 *         post:
 *           summary: Add test to test collection
 *           parameters:
 *              -   in: body
 *                  name: test
 *                  description: The test to create.
 *                  schema:
 *                      type: object
 *                      required:
 *                          -   course
 *                          -   date
 *                      properties:
 *                          course:
 *                              type: string
 *                          date:
 *                              type: date
 *           responses:
 *              '201':
 *                  description: "[Saved document test]"
 *              '400':
 *                  description: "Bad request"
 *              '500':
 *                  description: "Failed to save document"
 *         delete:
 *           summary: Deletes all documents in the test collection
 *           responses:
 *              '200':
 *                  description: "[Count of deleted documents]"
 *              '500':
 *                  description: "Failed to delete document"
 */
router
  .route("/")
  .get((req, res) => {
    TestModel.find({})
      .then(alltests => res.json(200, alltests))
      .catch(() => res.sendStatus(500));
  })

  .put((req, res) => res.sendStatus(501))

  .post(({ body: { course, date } }, res) => {
    if (!course || !date) {
      return res.sendStatus(400);
    }

    const test = new TestModel({ course, date }, {});
    test
      .save()
      .then(savedtest => {
        rabbit.publish("ex.1", {
          routingKey: "studentExamined",
          type: "studentExamined",
          body: savedtest
        });
        res.status(201).json(savedtest);
      })
      .catch(err => res.sendStatus(500));
  })

  .delete((req, res) =>
    TestModel.remove({})
      .then(deleted => res.json(200, deleted))
      .catch(() => res.sendStatus(500))
  );

/**
 * @swagger
 * /{_id}/enroll-student:
 *    post:
 *      description: add student to test
 *      produces:
 *        - application/json
 *      parameters:
 *      - name: _id
 *        description: The id of the test
 *        required: true
 *        in: path
 *        type: string
 *      - name: firstName
 *        description: The student's first name
 *        required: true
 *        in: formData
 *        type: string
 *      - name: lastName
 *        description: The student's last adress
 *        required: true
 *        in: formData
 *        type: string
 *      responses:
 *        201:
 *          description: Return test
 *        400:
 *          description: Something unexpected went wrong
 */
router
  .route("/:_id/enroll-student")
  .post(({ body: { firstName, lastName }, params: { _id } }, res) => {
    if (!_id || !firstName || !lastName) {
      return res.sendStatus(400);
    }

    TestModel.findById(_id).then(test => {
      test.enrolledStudents.push({ firstName, lastName });
      test
        .save()
        .then(savedtest => res.json(201, savedtest))
        .catch(err => res.sendStatus(500));
    });
  });

router
  .route("/:testId/student/:studentId")
  .post(
    (
      {
        params: { testId, studentId },
        body: { grade, teacherFirstName, teacherLastName }
      },
      res
    ) => {
      if (
        !testId ||
        !studentId ||
        !grade ||
        !teacherFirstName ||
        !teacherLastName
      ) {
        return res.sendStatus(400);
      }

      TestModel.findById(testId).then(test => {
        const { firstName, lastName } = test.enrolledStudents.id(studentId);
        test.grades.push({
          student: {
            firstName,
            lastName
          },
          teacher: {
            firstName: teacherFirstName,
            lastName: teacherLastName
          },
          grade,
          date: Date.now()
        });
        test
          .save()
          .then(savedtest => {
            rabbit.publish("ex.1", {
              routingKey: "studentGraded",
              type: "studentGraded",
              body: savedtest
            });
            res.status(201).json(savedtest);
          })
          .catch(err => res.sendStatus(500));
      });
    }
  );

module.exports = router;
