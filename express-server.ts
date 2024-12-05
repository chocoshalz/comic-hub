import express, { Request, Response, NextFunction } from "express";
import next from "next";

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware to handle errors
  const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error occurred:", err.message); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  };

  // Example API endpoint with try-catch for specific error handling
  server.get("/api/greet", (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ message: "Hello from Express!" });
    } catch (err) {
      next(err); // Pass the error to the error-handling middleware
    }
  });

  // Middleware for 404 errors
  server.use((req, res, next) => {
    res.status(404).json({ error: "Route Not Found" });
  });

  // Apply the error-handling middleware
  server.use(errorHandler);

  // Handle Next.js routes
  server.all("*", (req: Request, res: Response) => {
    return handle(req, res).catch((err) => {
      console.error("Next.js route error:", err.message); // Log error
      res.status(500).json({ error: "Failed to render route" });
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
