import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContractSchema, insertContractMilestoneSchema, insertTouchPointSchema,
  insertComplianceRuleSchema, insertComplianceCheckSchema, insertRiskAssessmentSchema,
  insertAuditLogSchema
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  // Contracts routes
  app.get("/api/contracts", async (req, res) => {
    try {
      const { limit = "50", offset = "0", status } = req.query;
      let contracts;
      
      if (status) {
        contracts = await storage.getContractsByStatus(status as string);
      } else {
        contracts = await storage.getContracts(parseInt(limit as string), parseInt(offset as string));
      }
      
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.get("/api/contracts/high-risk", async (req, res) => {
    try {
      const contracts = await storage.getHighRiskContracts();
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching high-risk contracts:", error);
      res.status(500).json({ message: "Failed to fetch high-risk contracts" });
    }
  });

  app.get("/api/contracts/:id", async (req, res) => {
    try {
      const contract = await storage.getContract(req.params.id);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      console.error("Error fetching contract:", error);
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  app.post("/api/contracts", upload.single('file'), async (req, res) => {
    try {
      const contractData = JSON.parse(req.body.contractData || '{}');
      
      // Add file information if uploaded
      if (req.file) {
        contractData.fileUrl = `/uploads/${req.file.filename}`;
        contractData.fileName = req.file.originalname;
        contractData.fileSize = req.file.size;
      }

      // Generate contract number if not provided
      if (!contractData.contractNumber) {
        contractData.contractNumber = `GOV-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
      }

      // Set default creator (in real app, get from auth)
      contractData.createdBy = "system-user-id";

      const validatedData = insertContractSchema.parse(contractData);
      const contract = await storage.createContract(validatedData);

      // Create audit log
      await storage.createAuditLog({
        entityType: "contract",
        entityId: contract.id,
        action: "create",
        changes: { created: contract },
        userId: "system-user-id",
      });

      res.status(201).json(contract);
    } catch (error) {
      console.error("Error creating contract:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contract" });
    }
  });

  app.put("/api/contracts/:id", async (req, res) => {
    try {
      const validatedData = insertContractSchema.partial().parse(req.body);
      const contract = await storage.updateContract(req.params.id, validatedData);

      // Create audit log
      await storage.createAuditLog({
        entityType: "contract",
        entityId: contract.id,
        action: "update",
        changes: validatedData,
        userId: "system-user-id",
      });

      res.json(contract);
    } catch (error) {
      console.error("Error updating contract:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update contract" });
    }
  });

  app.delete("/api/contracts/:id", async (req, res) => {
    try {
      await storage.deleteContract(req.params.id);

      // Create audit log
      await storage.createAuditLog({
        entityType: "contract",
        entityId: req.params.id,
        action: "delete",
        userId: "system-user-id",
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting contract:", error);
      res.status(500).json({ message: "Failed to delete contract" });
    }
  });

  // Contract milestones
  app.get("/api/contracts/:id/milestones", async (req, res) => {
    try {
      const milestones = await storage.getContractMilestones(req.params.id);
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  app.post("/api/contracts/:id/milestones", async (req, res) => {
    try {
      const milestoneData = { ...req.body, contractId: req.params.id };
      const validatedData = insertContractMilestoneSchema.parse(milestoneData);
      const milestone = await storage.createContractMilestone(validatedData);
      res.status(201).json(milestone);
    } catch (error) {
      console.error("Error creating milestone:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create milestone" });
    }
  });

  // Touch points
  app.get("/api/touch-points", async (req, res) => {
    try {
      const { contractId, limit = "50" } = req.query;
      const touchPoints = await storage.getTouchPoints(
        contractId as string | undefined,
        parseInt(limit as string)
      );
      res.json(touchPoints);
    } catch (error) {
      console.error("Error fetching touch points:", error);
      res.status(500).json({ message: "Failed to fetch touch points" });
    }
  });

  app.post("/api/touch-points", async (req, res) => {
    try {
      const validatedData = insertTouchPointSchema.parse(req.body);
      const touchPoint = await storage.createTouchPoint(validatedData);
      res.status(201).json(touchPoint);
    } catch (error) {
      console.error("Error creating touch point:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create touch point" });
    }
  });

  // Compliance rules
  app.get("/api/compliance/rules", async (req, res) => {
    try {
      const rules = await storage.getComplianceRules();
      res.json(rules);
    } catch (error) {
      console.error("Error fetching compliance rules:", error);
      res.status(500).json({ message: "Failed to fetch compliance rules" });
    }
  });

  app.post("/api/compliance/rules", async (req, res) => {
    try {
      const validatedData = insertComplianceRuleSchema.parse(req.body);
      const rule = await storage.createComplianceRule(validatedData);
      res.status(201).json(rule);
    } catch (error) {
      console.error("Error creating compliance rule:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create compliance rule" });
    }
  });

  // Compliance checks
  app.get("/api/compliance/checks", async (req, res) => {
    try {
      const { contractId } = req.query;
      const checks = await storage.getComplianceChecks(contractId as string | undefined);
      res.json(checks);
    } catch (error) {
      console.error("Error fetching compliance checks:", error);
      res.status(500).json({ message: "Failed to fetch compliance checks" });
    }
  });

  app.post("/api/compliance/checks", async (req, res) => {
    try {
      const validatedData = insertComplianceCheckSchema.parse(req.body);
      const check = await storage.createComplianceCheck(validatedData);
      res.status(201).json(check);
    } catch (error) {
      console.error("Error creating compliance check:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create compliance check" });
    }
  });

  // Risk assessments
  app.get("/api/contracts/:id/risk-assessment", async (req, res) => {
    try {
      const assessment = await storage.getRiskAssessment(req.params.id);
      if (!assessment) {
        return res.status(404).json({ message: "Risk assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching risk assessment:", error);
      res.status(500).json({ message: "Failed to fetch risk assessment" });
    }
  });

  app.post("/api/contracts/:id/risk-assessment", async (req, res) => {
    try {
      const assessmentData = { ...req.body, contractId: req.params.id };
      const validatedData = insertRiskAssessmentSchema.parse(assessmentData);
      const assessment = await storage.createRiskAssessment(validatedData);
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating risk assessment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create risk assessment" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
