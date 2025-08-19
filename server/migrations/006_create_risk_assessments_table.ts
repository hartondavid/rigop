import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("risk_assessments", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("contract_id").references("id").inTable("contracts").notNullable();
        table.jsonb("factors").notNullable();
        table.decimal("score", 3, 1).notNullable();
        table.specificType("level", "risk_level").notNullable();
        table.specificType("recommendations", "text[]");
        table.timestamp("assessed_at").defaultTo(knex.fn.now()).notNullable();
        table.uuid("assessed_by").references("id").inTable("users");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("risk_assessments");
}
