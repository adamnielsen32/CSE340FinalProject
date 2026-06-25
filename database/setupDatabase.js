import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbName = process.env.DB_NAME || "dealership";

const adminConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_ADMIN_DATABASE || "postgres",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};

const appConfig = {
  ...adminConfig,
  database: dbName
};

function quoteIdentifier(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

async function ensureDatabase() {
  const client = new Client(adminConfig);
  await client.connect();

  const result = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE ${quoteIdentifier(dbName)}`);
    console.log(`Created database "${dbName}".`);
  } else {
    console.log(`Database "${dbName}" already exists.`);
  }

  await client.end();
}

async function runSqlFile(client, filename) {
  const sql = await fs.readFile(path.join(__dirname, filename), "utf8");
  await client.query(sql);
  console.log(`Ran ${filename}.`);
}

async function setupDatabase() {
  await ensureDatabase();

  const client = new Client(appConfig);
  await client.connect();

  try {
    await runSqlFile(client, "schema.sql");
    await runSqlFile(client, "seed.sql");
  } finally {
    await client.end();
  }

  console.log("Database setup complete.");
}

setupDatabase().catch((error) => {
  console.error("Database setup failed:");
  console.error(error);
  process.exit(1);
});
