# Database Setup and Usage Guide

This project uses both **Drizzle ORM** and **Knex.js** for database operations, providing flexibility for different use cases.

## Database Configuration

### Environment Variables

Make sure you have the following environment variable set:

```bash
DATABASE_URL=postgresql://username:password@host:port/database
```

### Knex Configuration

The Knex configuration is in `knexfile.ts` and supports both development and production environments.

## Database Setup

### 1. Install Dependencies

```bash
npm install knex pg @types/pg
```

### 2. Run Migrations

```bash
# Run all migrations
npx knex migrate:latest

# Rollback migrations
npx knex migrate:rollback

# Create a new migration
npx knex migrate:make migration_name
```

### 3. Run Seeds

```bash
# Run all seeds
npx knex seed:run

# Run specific seed
npx knex seed:run --specific=01_users.ts
```

## Database Schema

The database includes the following tables:

- **users** - User accounts and roles
- **contracts** - Contract information and metadata
- **contract_milestones** - Contract milestone tracking
- **touch_points** - Contract interaction history
- **compliance_rules** - Compliance rule definitions
- **compliance_checks** - Compliance check results
- **risk_assessments** - Risk assessment data
- **audit_logs** - System audit trail

## Usage Examples

### Using Drizzle ORM (Type-safe, recommended for simple operations)

```typescript
import { db } from '../server/db';
import { contracts, users } from '../shared/schema';

// Simple queries
const allContracts = await db.select().from(contracts);
const user = await db.select().from(users).where(eq(users.id, userId));

// Insert with type safety
const newContract = await db.insert(contracts).values({
  title: "New Contract",
  vendor: "Vendor Name",
  value: 10000,
  // ... other fields
}).returning();
```

### Using Knex.js (Flexible, recommended for complex queries)

```typescript
import { knexInstance } from '../server/knex';

// Complex joins
const contractsWithUsers = await knexInstance
  .select('c.*', 'u.username as assigned_user')
  .from('contracts as c')
  .leftJoin('users as u', 'c.assigned_to', 'u.id');

// Raw SQL
const riskSummary = await knexInstance.raw(`
  SELECT risk_level, COUNT(*) as count 
  FROM contracts 
  GROUP BY risk_level
`);

// Transactions
await knexInstance.transaction(async (trx) => {
  const [contractId] = await trx('contracts')
    .insert(contractData)
    .returning('id');
  
  await trx('contract_milestones')
    .insert(milestones.map(m => ({ ...m, contract_id: contractId })));
});
```

### Using the Database Service

```typescript
import { DatabaseService } from '../server/services/database';

// Get contracts with user details
const contractsWithDetails = await DatabaseService.getContractsWithDetails();

// Get compliance summary
const complianceSummary = await DatabaseService.getComplianceSummary();

// Create contract with milestones in transaction
const contractId = await DatabaseService.createContractWithMilestones(
  contractData, 
  milestones
);
```

## Migration Management

### Creating New Migrations

```bash
npx knex migrate:make add_new_table
```

### Migration File Structure

```typescript
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("table_name", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.text("name").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("table_name");
}
```

### Seed File Structure

```typescript
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("table_name").del();
  
  await knex("table_name").insert([
    { name: "Sample Data 1" },
    { name: "Sample Data 2" },
  ]);
}
```

## Best Practices

### When to Use Drizzle ORM

- Simple CRUD operations
- Type-safe queries
- Automatic schema validation
- Performance-critical simple queries

### When to Use Knex.js

- Complex joins and relationships
- Raw SQL queries
- Database-specific features
- Complex aggregations
- Transactions with multiple operations

### Performance Considerations

- Use Drizzle for simple, frequent queries
- Use Knex for complex, one-time queries
- Implement proper indexing on frequently queried columns
- Use transactions for data consistency
- Consider query optimization for large datasets

## Troubleshooting

### Common Issues

1. **Connection Errors**: Check your `DATABASE_URL` environment variable
2. **Migration Errors**: Ensure all previous migrations have been run
3. **Type Errors**: Check that your schema types match your database schema
4. **Performance Issues**: Use query analysis tools to identify slow queries

### Debugging

```typescript
// Enable Knex query logging
const knex = require('knex')({
  ...config,
  debug: true
});

// Log Drizzle queries
console.log(db.select().from(contracts).toSQL());
```

## Database Maintenance

### Regular Tasks

- Monitor query performance
- Update database statistics
- Clean up old audit logs
- Backup important data
- Review and optimize indexes

### Backup and Recovery

```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

## Security Considerations

- Use parameterized queries to prevent SQL injection
- Implement proper access controls
- Audit database access
- Encrypt sensitive data
- Regular security updates

For more information, refer to:
- [Knex.js Documentation](https://knexjs.org/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
