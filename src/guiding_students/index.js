const express = require("express");
const logger = require("morgan");
const bodyparser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const router = require("./router");
const rabbitMQ = require("./config/rabbitmq");
const app = express();

const rabbit = require("./rabbit/rabbot");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Guiding students",
      description: "The API of the Guiding students"
    },
    basePath: "/api/v1/guiding_students",
    produces: ["application/json"],
    schemes: ["https"]
  },
  apis: ["/app/router.js"]
};

app.use(logger("dev"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const specs = swaggerJsdoc(swaggerOptions);
const swaggerUi = require("swagger-ui-express");

app.use(
  "/api/v1/guiding_students/swagger",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.use("/api/v1/guiding_students", router);

app.listen(process.env.PORT || 3000);
