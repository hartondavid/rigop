import express, { type Request, Response, NextFunction } from "express";
import { serveStatic } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Initialize routes lazily to avoid startup errors
let routesInitialized = false;

async function initializeRoutes() {
    if (routesInitialized) return;

    try {
        const { registerRoutes } = await import("./routes");
        await registerRoutes(app);
        routesInitialized = true;
        console.log("Routes initialized successfully");
    } catch (error) {
        console.error("Failed to initialize routes:", error);
    }
}

// Initialize routes on first request
app.use(async (req, res, next) => {
    if (!routesInitialized) {
        await initializeRoutes();
    }
    next();
});

// Setup static file serving for production
serveStatic(app);

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Server error:", err);
    res.status(status).json({ message });
});

// Export the Express app for Vercel
export default app;
