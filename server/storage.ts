import { 
  users, contracts, contractMilestones, touchPoints, complianceRules, 
  complianceChecks, riskAssessments, auditLogs,
  type User, type InsertUser, type Contract, type InsertContract,
  type ContractMilestone, type InsertContractMilestone,
  type TouchPoint, type InsertTouchPoint,
  type ComplianceRule, type InsertComplianceRule,
  type ComplianceCheck, type InsertComplianceCheck,
  type RiskAssessment, type InsertRiskAssessment,
  type AuditLog, type InsertAuditLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Contracts
  getContracts(limit?: number, offset?: number): Promise<Contract[]>;
  getContract(id: string): Promise<Contract | undefined>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: string, contract: Partial<InsertContract>): Promise<Contract>;
  deleteContract(id: string): Promise<void>;
  getContractsByStatus(status: string): Promise<Contract[]>;
  getHighRiskContracts(): Promise<Contract[]>;

  // Contract Milestones
  getContractMilestones(contractId: string): Promise<ContractMilestone[]>;
  createContractMilestone(milestone: InsertContractMilestone): Promise<ContractMilestone>;
  updateContractMilestone(id: string, milestone: Partial<InsertContractMilestone>): Promise<ContractMilestone>;

  // Touch Points
  getTouchPoints(contractId?: string, limit?: number): Promise<TouchPoint[]>;
  createTouchPoint(touchPoint: InsertTouchPoint): Promise<TouchPoint>;

  // Compliance
  getComplianceRules(): Promise<ComplianceRule[]>;
  createComplianceRule(rule: InsertComplianceRule): Promise<ComplianceRule>;
  getComplianceChecks(contractId?: string): Promise<ComplianceCheck[]>;
  createComplianceCheck(check: InsertComplianceCheck): Promise<ComplianceCheck>;

  // Risk Assessments
  getRiskAssessment(contractId: string): Promise<RiskAssessment | undefined>;
  createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment>;

  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;

  // Dashboard Stats
  getDashboardStats(): Promise<{
    totalContracts: number;
    activeContracts: number;
    highRiskContracts: number;
    pendingReviews: number;
    complianceScore: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getContracts(limit = 50, offset = 0): Promise<Contract[]> {
    return await db.select().from(contracts)
      .orderBy(desc(contracts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getContract(id: string): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract || undefined;
  }

  async createContract(contract: InsertContract): Promise<Contract> {
    const [newContract] = await db.insert(contracts).values({
      ...contract,
      updatedAt: new Date(),
    }).returning();
    return newContract;
  }

  async updateContract(id: string, contract: Partial<InsertContract>): Promise<Contract> {
    const [updatedContract] = await db.update(contracts)
      .set({ ...contract, updatedAt: new Date() })
      .where(eq(contracts.id, id))
      .returning();
    return updatedContract;
  }

  async deleteContract(id: string): Promise<void> {
    await db.delete(contracts).where(eq(contracts.id, id));
  }

  async getContractsByStatus(status: string): Promise<Contract[]> {
    return await db.select().from(contracts)
      .where(eq(contracts.status, status as any))
      .orderBy(desc(contracts.createdAt));
  }

  async getHighRiskContracts(): Promise<Contract[]> {
    return await db.select().from(contracts)
      .where(eq(contracts.riskLevel, 'high'))
      .orderBy(desc(contracts.riskScore));
  }

  async getContractMilestones(contractId: string): Promise<ContractMilestone[]> {
    return await db.select().from(contractMilestones)
      .where(eq(contractMilestones.contractId, contractId))
      .orderBy(contractMilestones.order);
  }

  async createContractMilestone(milestone: InsertContractMilestone): Promise<ContractMilestone> {
    const [newMilestone] = await db.insert(contractMilestones).values(milestone).returning();
    return newMilestone;
  }

  async updateContractMilestone(id: string, milestone: Partial<InsertContractMilestone>): Promise<ContractMilestone> {
    const [updatedMilestone] = await db.update(contractMilestones)
      .set(milestone)
      .where(eq(contractMilestones.id, id))
      .returning();
    return updatedMilestone;
  }

  async getTouchPoints(contractId?: string, limit = 50): Promise<TouchPoint[]> {
    const query = db.select().from(touchPoints);
    
    if (contractId) {
      return await query
        .where(eq(touchPoints.contractId, contractId))
        .orderBy(desc(touchPoints.createdAt))
        .limit(limit);
    }
    
    return await query
      .orderBy(desc(touchPoints.createdAt))
      .limit(limit);
  }

  async createTouchPoint(touchPoint: InsertTouchPoint): Promise<TouchPoint> {
    const [newTouchPoint] = await db.insert(touchPoints).values(touchPoint).returning();
    return newTouchPoint;
  }

  async getComplianceRules(): Promise<ComplianceRule[]> {
    return await db.select().from(complianceRules)
      .where(eq(complianceRules.isActive, true))
      .orderBy(complianceRules.category, complianceRules.name);
  }

  async createComplianceRule(rule: InsertComplianceRule): Promise<ComplianceRule> {
    const [newRule] = await db.insert(complianceRules).values({
      ...rule,
      updatedAt: new Date(),
    }).returning();
    return newRule;
  }

  async getComplianceChecks(contractId?: string): Promise<ComplianceCheck[]> {
    const query = db.select({
      id: complianceChecks.id,
      contractId: complianceChecks.contractId,
      ruleId: complianceChecks.ruleId,
      status: complianceChecks.status,
      details: complianceChecks.details,
      checkedAt: complianceChecks.checkedAt,
      checkedBy: complianceChecks.checkedBy,
      ruleName: complianceRules.name,
      ruleCategory: complianceRules.category,
    }).from(complianceChecks)
      .leftJoin(complianceRules, eq(complianceChecks.ruleId, complianceRules.id));

    if (contractId) {
      return await query.where(eq(complianceChecks.contractId, contractId));
    }

    return await query.orderBy(desc(complianceChecks.checkedAt));
  }

  async createComplianceCheck(check: InsertComplianceCheck): Promise<ComplianceCheck> {
    const [newCheck] = await db.insert(complianceChecks).values(check).returning();
    return newCheck;
  }

  async getRiskAssessment(contractId: string): Promise<RiskAssessment | undefined> {
    const [assessment] = await db.select().from(riskAssessments)
      .where(eq(riskAssessments.contractId, contractId))
      .orderBy(desc(riskAssessments.assessedAt))
      .limit(1);
    return assessment || undefined;
  }

  async createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const [newAssessment] = await db.insert(riskAssessments).values(assessment).returning();
    return newAssessment;
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }

  async getDashboardStats(): Promise<{
    totalContracts: number;
    activeContracts: number;
    highRiskContracts: number;
    pendingReviews: number;
    complianceScore: number;
  }> {
    const [totalContractsResult] = await db
      .select({ count: count() })
      .from(contracts);

    const [activeContractsResult] = await db
      .select({ count: count() })
      .from(contracts)
      .where(eq(contracts.status, 'active'));

    const [highRiskContractsResult] = await db
      .select({ count: count() })
      .from(contracts)
      .where(eq(contracts.riskLevel, 'high'));

    const [pendingReviewsResult] = await db
      .select({ count: count() })
      .from(contracts)
      .where(eq(contracts.status, 'under_review'));

    const [complianceResult] = await db
      .select({ 
        total: count(),
        compliant: count(sql`CASE WHEN ${complianceChecks.status} = 'compliant' THEN 1 END`)
      })
      .from(complianceChecks);

    const complianceScore = complianceResult.total > 0 
      ? Math.round((complianceResult.compliant / complianceResult.total) * 100 * 10) / 10
      : 100;

    return {
      totalContracts: totalContractsResult.count,
      activeContracts: activeContractsResult.count,
      highRiskContracts: highRiskContractsResult.count,
      pendingReviews: pendingReviewsResult.count,
      complianceScore,
    };
  }
}

export const storage = new DatabaseStorage();
