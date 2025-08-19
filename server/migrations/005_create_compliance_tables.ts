import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Create the compliance status enum
    await knex.raw(`
    CREATE TYPE compliance_status AS ENUM ('compliant', 'non_compliant', 'pending_review', 'needs_attention');
  `);

    // Create compliance rules table
    await knex.schema.createTable("compliance_rules", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.text("name").notNullable();
        table.text("description");
        table.text("category").notNullable();
        table.text("rule_type").notNullable();
        table.jsonb("conditions").notNullable();
        table.boolean("is_active").notNullable().defaultTo(true);
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
        table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    });

    // Create compliance checks table
    return knex.schema.createTable("compliance_checks", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("contract_id").references("id").inTable("contracts").notNullable();
        table.uuid("rule_id").references("id").inTable("compliance_rules").notNullable();
        table.specificType("status", "compliance_status").notNullable();
        table.text("details");
        table.timestamp("checked_at").defaultTo(knex.fn.now()).notNullable();
        table.uuid("checked_by").references("id").inTable("users");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("compliance_checks");
    await knex.schema.dropTable("compliance_rules");
    await knex.raw(`
    DROP TYPE IF EXISTS compliance_status;
  `);
}
