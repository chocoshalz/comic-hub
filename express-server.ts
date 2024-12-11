import express, { Request, Response } from "express";
import next from "next";

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Example API endpoint
  server.get("/api/greet", (req: Request, res: Response) => {
    res.json({ message: "Hello from Express!" });
  });

  // Handle Next.js routes
  server.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
