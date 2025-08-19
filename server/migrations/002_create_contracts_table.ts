import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // First create the enums
    await knex.raw(`
    CREATE TYPE contract_status AS ENUM ('draft', 'under_review', 'active', 'completed', 'cancelled', 'expired');
    CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');
  `);

    return knex.schema.createTable("contracts", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.text("contract_number").notNullable().unique();
        table.text("title").notNullable();
        table.text("description");
        table.text("vendor").notNullable();
        table.decimal("value", 12, 2).notNullable();
        table.text("currency").notNullable().defaultTo("EUR");
        table.specificType("status", "contract_status").notNullable().defaultTo("draft");
        table.decimal("risk_score", 3, 1);
        table.specificType("risk_level", "risk_level");
        table.timestamp("start_date");
        table.timestamp("end_date");
        table.text("category");
        table.specificType("tags", "text[]");
        table.text("file_url");
        table.text("file_name");
        table.integer("file_size");
        table.uuid("assigned_to").references("id").inTable("users");
        table.uuid("created_by").references("id").inTable("users").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
        table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("contracts");
    await knex.raw(`
    DROP TYPE IF EXISTS contract_status;
    DROP TYPE IF EXISTS risk_level;
  `);
}
