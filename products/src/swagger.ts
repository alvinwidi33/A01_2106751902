import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const isDev = process.env.NODE_ENV !== "production";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Dokumentasi API menggunakan Swagger di Express + TypeScript",
    },
    servers: [
      {
        url: isDev ? "http://localhost:8890" : "http://localhost:8002",
        description: isDev ? "Local server" : "Production server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: [
    path.resolve(__dirname, isDev ? "../src/product/product.routes.ts" : "./product/product.routes.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
