import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    // Note: In production, use proper password hashing
    const hashedPassword = "$2b$10$example.hash.for.demo.purposes.only";

    await knex("users").insert([
        {
            id: "550e8400-e29b-41d4-a716-446655440000",
            username: "admin",
            password: hashedPassword,
            email: "admin@rigopa.gov",
            role: "admin",
            department: "IT",
        },
        {
            id: "550e8400-e29b-41d4-a716-446655440001",
            username: "manager",
            password: hashedPassword,
            email: "manager@rigopa.gov",
            role: "manager",
            department: "Procurement",
        },
        {
            id: "550e8400-e29b-41d4-a716-446655440002",
            username: "analyst",
            password: hashedPassword,
            email: "analyst@rigopa.gov",
            role: "analyst",
            department: "Risk Management",
        },
    ]);
}
