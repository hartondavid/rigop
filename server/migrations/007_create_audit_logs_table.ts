import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("audit_logs", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.text("entity_type").notNullable();
        table.uuid("entity_id").notNullable();
        table.text("action").notNullable();
        table.jsonb("changes");
        table.uuid("user_id").references("id").inTable("users");
        table.text("ip_address");
        table.text("user_agent");
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("audit_logs");
}
