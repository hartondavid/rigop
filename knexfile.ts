import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "postgresql",
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./server/migrations",
        },
        seeds: {
            directory: "./server/seeds",
        },
    },

    production: {
        client: "postgresql",
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./server/migrations",
        },
        seeds: {
            directory: "./server/seeds",
        },
    },
};

export default config;
