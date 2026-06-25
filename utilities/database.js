import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const { Pool } = pg;

const sslCertPath = process.env.PG_SSL_CERT_PATH;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 2,
  ssl: {
    ca: fs.readFileSync(sslCertPath).toString(),
    rejectUnauthorized: true,
  },
});

export default pool;