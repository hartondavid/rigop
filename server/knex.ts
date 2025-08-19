import knex from "knex";
import config from "../knexfile";

const environment = process.env.NODE_ENV || "development";
const knexConfig = config[environment];

export const knexInstance = knex(knexConfig);

// Export a function to get the database instance
export const getKnex = () => knexInstance;

// Export the raw query builder for complex queries
export const db = knexInstance;

// Helper function to close the database connection
export const closeKnex = async () => {
    await knexInstance.destroy();
};

// Export types for better TypeScript support
export type KnexQueryBuilder = ReturnType<typeof knexInstance>;
