import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Create the touch point type enum
    await knex.raw(`
    CREATE TYPE touch_point_type AS ENUM ('email', 'meeting', 'document_update', 'milestone', 'alert', 'review');
  `);

    return knex.schema.createTable("touch_points", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("contract_id").references("id").inTable("contracts").notNullable();
        table.specificType("type", "touch_point_type").notNullable();
        table.text("title").notNullable();
        table.text("description");
        table.text("source");
        table.jsonb("metadata");
        table.uuid("user_id").references("id").inTable("users");
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("touch_points");
    await knex.raw(`
    DROP TYPE IF EXISTS touch_point_type;
  `);
}
