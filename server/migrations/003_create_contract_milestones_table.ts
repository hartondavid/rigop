import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("contract_milestones", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("contract_id").references("id").inTable("contracts").notNullable();
        table.text("title").notNullable();
        table.text("description");
        table.timestamp("due_date").notNullable();
        table.timestamp("completed_date");
        table.boolean("is_completed").notNullable().defaultTo(false);
        table.integer("order").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("contract_milestones");
}
