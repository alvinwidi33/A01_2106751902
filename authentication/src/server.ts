import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./user/user.routes";
import express_prom_bundle from "express-prom-bundle";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger"; 

const app: Express = express();

const metricsMiddleware = express_prom_bundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project_name: "authentication" },
  promClient: {
    collectDefaultMetrics: {},
  },
});

// Middleware
app.use(metricsMiddleware);
app.use(cors());
app.use(express.json());

// Swagger API Docs Middleware
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ status: "healthy" });
});

// Root endpoint
app.get("/", (_, res) => {
  res.status(200).json({
    message: "Authentication API",
    version: "1.0.0",
  });
});

// Not Found Middleware
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Not Found",
    path: req.path,
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
