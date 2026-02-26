import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
    },
  },
  apis: ["./src/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerSpec, swaggerUi };
