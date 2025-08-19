import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("contracts").del();

    // Inserts seed entries
    await knex("contracts").insert([
        {
            id: "660e8400-e29b-41d4-a716-446655440000",
            contract_number: "CON-2024-001",
            title: "IT Infrastructure Services",
            description: "Comprehensive IT infrastructure management and support services",
            vendor: "TechCorp Solutions",
            value: 150000.00,
            currency: "EUR",
            status: "active",
            risk_score: 7.5,
            risk_level: "medium",
            start_date: new Date("2024-01-01"),
            end_date: new Date("2024-12-31"),
            category: "IT Services",
            tags: ["infrastructure", "support", "cloud"],
            created_by: "550e8400-e29b-41d4-a716-446655440000",
        },
        {
            id: "660e8400-e29b-41d4-a716-446655440001",
            contract_number: "CON-2024-002",
            title: "Office Supplies Procurement",
            description: "Annual office supplies and equipment procurement contract",
            vendor: "OfficeMax Supplies",
            value: 25000.00,
            currency: "EUR",
            status: "draft",
            risk_score: 3.0,
            risk_level: "low",
            start_date: new Date("2024-03-01"),
            end_date: new Date("2025-02-28"),
            category: "Procurement",
            tags: ["supplies", "equipment", "annual"],
            created_by: "550e8400-e29b-41d4-a716-446655440001",
        },
        {
            id: "660e8400-e29b-41d4-a716-446655440002",
            contract_number: "CON-2024-003",
            title: "Security Consulting Services",
            description: "Cybersecurity assessment and consulting services",
            vendor: "SecureNet Consulting",
            value: 75000.00,
            currency: "EUR",
            status: "under_review",
            risk_score: 8.5,
            risk_level: "high",
            start_date: new Date("2024-04-01"),
            end_date: new Date("2024-09-30"),
            category: "Security",
            tags: ["cybersecurity", "consulting", "assessment"],
            created_by: "550e8400-e29b-41d4-a716-446655440002",
        },
    ]);
}
