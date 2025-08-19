import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const contractStatusEnum = pgEnum('contract_status', [
  'draft', 'under_review', 'active', 'completed', 'cancelled', 'expired'
]);

export const riskLevelEnum = pgEnum('risk_level', [
  'low', 'medium', 'high', 'critical'
]);

export const touchPointTypeEnum = pgEnum('touch_point_type', [
  'email', 'meeting', 'document_update', 'milestone', 'alert', 'review'
]);

export const complianceStatusEnum = pgEnum('compliance_status', [
  'compliant', 'non_compliant', 'pending_review', 'needs_attention'
]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"),
  department: text("department"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contracts table
export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractNumber: text("contract_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  vendor: text("vendor").notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("EUR"),
  status: contractStatusEnum("status").notNull().default("draft"),
  riskScore: decimal("risk_score", { precision: 3, scale: 1 }),
  riskLevel: riskLevelEnum("risk_level"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  category: text("category"),
  tags: text("tags").array(),
  fileUrl: text("file_url"),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Contract milestones
export const contractMilestones = pgTable("contract_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractId: varchar("contract_id").references(() => contracts.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  completedDate: timestamp("completed_date"),
  isCompleted: boolean("is_completed").notNull().default(false),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Touch points (interactions/history)
export const touchPoints = pgTable("touch_points", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractId: varchar("contract_id").references(() => contracts.id).notNull(),
  type: touchPointTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  source: text("source"), // email, system, user, etc.
  metadata: jsonb("metadata"), // additional data like email details, file info, etc.
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Compliance rules
export const complianceRules = pgTable("compliance_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  ruleType: text("rule_type").notNull(), // contract_value, clause_required, timeline, etc.
  conditions: jsonb("conditions").notNull(), // rule logic
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Compliance checks
export const complianceChecks = pgTable("compliance_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractId: varchar("contract_id").references(() => contracts.id).notNull(),
  ruleId: varchar("rule_id").references(() => complianceRules.id).notNull(),
  status: complianceStatusEnum("status").notNull(),
  details: text("details"),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
  checkedBy: varchar("checked_by").references(() => users.id),
});

// Risk assessments
export const riskAssessments = pgTable("risk_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractId: varchar("contract_id").references(() => contracts.id).notNull(),
  factors: jsonb("factors").notNull(), // risk factors and weights
  score: decimal("score", { precision: 3, scale: 1 }).notNull(),
  level: riskLevelEnum("level").notNull(),
  recommendations: text("recommendations").array(),
  assessedAt: timestamp("assessed_at").defaultNow().notNull(),
  assessedBy: varchar("assessed_by").references(() => users.id),
});

// Audit logs
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(), // contract, user, compliance, etc.
  entityId: varchar("entity_id").notNull(),
  action: text("action").notNull(), // create, update, delete, etc.
  changes: jsonb("changes"), // what changed
  userId: varchar("user_id").references(() => users.id),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  contracts: many(contracts),
  touchPoints: many(touchPoints),
  complianceChecks: many(complianceChecks),
  riskAssessments: many(riskAssessments),
  auditLogs: many(auditLogs),
}));

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  assignedUser: one(users, {
    fields: [contracts.assignedTo],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [contracts.createdBy],
    references: [users.id],
  }),
  milestones: many(contractMilestones),
  touchPoints: many(touchPoints),
  complianceChecks: many(complianceChecks),
  riskAssessments: many(riskAssessments),
}));

export const contractMilestonesRelations = relations(contractMilestones, ({ one }) => ({
  contract: one(contracts, {
    fields: [contractMilestones.contractId],
    references: [contracts.id],
  }),
}));

export const touchPointsRelations = relations(touchPoints, ({ one }) => ({
  contract: one(contracts, {
    fields: [touchPoints.contractId],
    references: [contracts.id],
  }),
  user: one(users, {
    fields: [touchPoints.userId],
    references: [users.id],
  }),
}));

export const complianceRulesRelations = relations(complianceRules, ({ many }) => ({
  checks: many(complianceChecks),
}));

export const complianceChecksRelations = relations(complianceChecks, ({ one }) => ({
  contract: one(contracts, {
    fields: [complianceChecks.contractId],
    references: [contracts.id],
  }),
  rule: one(complianceRules, {
    fields: [complianceChecks.ruleId],
    references: [complianceRules.id],
  }),
  checkedByUser: one(users, {
    fields: [complianceChecks.checkedBy],
    references: [users.id],
  }),
}));

export const riskAssessmentsRelations = relations(riskAssessments, ({ one }) => ({
  contract: one(contracts, {
    fields: [riskAssessments.contractId],
    references: [contracts.id],
  }),
  assessedByUser: one(users, {
    fields: [riskAssessments.assessedBy],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContractMilestoneSchema = createInsertSchema(contractMilestones).omit({
  id: true,
  createdAt: true,
});

export const insertTouchPointSchema = createInsertSchema(touchPoints).omit({
  id: true,
  createdAt: true,
});

export const insertComplianceRuleSchema = createInsertSchema(complianceRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertComplianceCheckSchema = createInsertSchema(complianceChecks).omit({
  id: true,
  checkedAt: true,
});

export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).omit({
  id: true,
  assessedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;

export type ContractMilestone = typeof contractMilestones.$inferSelect;
export type InsertContractMilestone = z.infer<typeof insertContractMilestoneSchema>;

export type TouchPoint = typeof touchPoints.$inferSelect;
export type InsertTouchPoint = z.infer<typeof insertTouchPointSchema>;

export type ComplianceRule = typeof complianceRules.$inferSelect;
export type InsertComplianceRule = z.infer<typeof insertComplianceRuleSchema>;

export type ComplianceCheck = typeof complianceChecks.$inferSelect;
export type InsertComplianceCheck = z.infer<typeof insertComplianceCheckSchema>;

export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
