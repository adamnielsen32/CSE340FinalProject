# CSE340FinalProject

## Database Setup

This project uses PostgreSQL.

1. Install and start PostgreSQL locally.
2. Confirm the database settings in `.env`.
3. Run:

```bash
npm run db:setup
```

The setup command creates the `dealership` database if it does not exist, then runs `database/schema.sql` and `database/seed.sql`.

Seeded test accounts:

- Owner: `owner@example.com`
- Employee: `employee@example.com`
- Customer: `customer@example.com`

All seeded accounts use the required project password: `P@$$w0rd!`
