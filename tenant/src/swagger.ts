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
        url: "http://localhost:8003",
        description: "Local server",
      },
    ],
  },
  apis:[path.resolve(__dirname, isDev ? "../src/tenant/tenant.routes.ts" : "./tenant/tenant.routes.js")],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
