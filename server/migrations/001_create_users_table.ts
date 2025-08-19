import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.text("username").notNullable().unique();
        table.text("password").notNullable();
        table.text("email").notNullable().unique();
        table.text("role").notNullable().defaultTo("user");
        table.text("department");
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}
