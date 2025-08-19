import { db as drizzleDb } from "../db";
import { knexInstance, getKnex } from "../knex";
import type { KnexQueryBuilder } from "../knex";

// Export both database instances
export { drizzleDb, knexInstance, getKnex };

// Database service class that provides methods for both ORMs
export class DatabaseService {
    // Drizzle ORM methods
    static getDrizzle() {
        return drizzleDb;
    }

    // Knex methods
    static getKnex() {
        return knexInstance;
    }

    // Example: Get contracts with complex joins using Knex
    static async getContractsWithDetails() {
        return knexInstance
            .select(
                "c.*",
                "u.username as assigned_user",
                "creator.username as created_by_user"
            )
            .from("contracts as c")
            .leftJoin("users as u", "c.assigned_to", "u.id")
            .leftJoin("users as creator", "c.created_by", "creator.id")
            .orderBy("c.created_at", "desc");
    }

    // Example: Get contracts with risk assessment using Knex
    static async getContractsWithRiskAssessment() {
        return knexInstance
            .select(
                "c.*",
                "ra.score as risk_score",
                "ra.level as risk_level",
                "ra.recommendations"
            )
            .from("contracts as c")
            .leftJoin("risk_assessments as ra", "c.id", "ra.contract_id")
            .orderBy("ra.score", "desc");
    }

    // Example: Get compliance status summary using Knex
    static async getComplianceSummary() {
        return knexInstance
            .select(
                "cc.status",
                knexInstance.raw("COUNT(*) as count")
            )
            .from("compliance_checks as cc")
            .groupBy("cc.status");
    }

    // Example: Get audit trail using Knex
    static async getAuditTrail(entityType: string, entityId: string) {
        return knexInstance
            .select(
                "al.*",
                "u.username as user_name"
            )
            .from("audit_logs as al")
            .leftJoin("users as u", "al.user_id", "u.id")
            .where({
                entity_type: entityType,
                entity_id: entityId
            })
            .orderBy("al.created_at", "desc");
    }

    // Example: Complex query combining multiple tables
    static async getContractDashboardData() {
        return knexInstance
            .select(
                "c.id",
                "c.title",
                "c.status",
                "c.risk_score",
                "c.risk_level",
                knexInstance.raw("COUNT(DISTINCT cm.id) as milestone_count"),
                knexInstance.raw("COUNT(DISTINCT tp.id) as touch_point_count"),
                knexInstance.raw("COUNT(DISTINCT cc.id) as compliance_check_count")
            )
            .from("contracts as c")
            .leftJoin("contract_milestones as cm", "c.id", "cm.contract_id")
            .leftJoin("touch_points as tp", "c.id", "tp.contract_id")
            .leftJoin("compliance_checks as cc", "c.id", "cc.contract_id")
            .groupBy("c.id", "c.title", "c.status", "c.risk_score", "c.risk_level")
            .orderBy("c.created_at", "desc");
    }

    // Example: Transaction using Knex
    static async createContractWithMilestones(contractData: any, milestones: any[]) {
        return knexInstance.transaction(async (trx) => {
            // Insert contract
            const [contractId] = await trx("contracts")
                .insert(contractData)
                .returning("id");

            // Insert milestones
            if (milestones.length > 0) {
                const milestonesWithContractId = milestones.map(milestone => ({
                    ...milestone,
                    contract_id: contractId
                }));
                await trx("contract_milestones").insert(milestonesWithContractId);
            }

            return contractId;
        });
    }

    // Example: Raw SQL query using Knex
    static async getContractsByRiskCategory() {
        return knexInstance.raw(`
      SELECT 
        c.category,
        c.risk_level,
        COUNT(*) as contract_count,
        AVG(c.risk_score) as avg_risk_score,
        SUM(c.value) as total_value
      FROM contracts c
      WHERE c.status = 'active'
      GROUP BY c.category, c.risk_level
      ORDER BY avg_risk_score DESC
    `);
    }
}

// Export convenience functions
export const getContractsWithDetails = DatabaseService.getContractsWithDetails;
export const getContractsWithRiskAssessment = DatabaseService.getContractsWithRiskAssessment;
export const getComplianceSummary = DatabaseService.getComplianceSummary;
export const getAuditTrail = DatabaseService.getAuditTrail;
export const getContractDashboardData = DatabaseService.getContractDashboardData;
export const createContractWithMilestones = DatabaseService.createContractWithMilestones;
export const getContractsByRiskCategory = DatabaseService.getContractsByRiskCategory;
