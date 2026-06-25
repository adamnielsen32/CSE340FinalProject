import pool from "../utilities/database.js";

export async function createUser(firstName, lastName, email, hashedPassword) {
  const sql = `
    INSERT INTO users (first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id, first_name, last_name, email, role
  `;

  const result = await pool.query(sql, [
    firstName,
    lastName,
    email,
    hashedPassword,
  ]);

  return result.rows[0];
}

export async function getUserByEmail(email) {
  const sql = `
    SELECT user_id, first_name, last_name, email, password, role
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(sql, [email]);

  return result.rows[0];
}

export async function getUserById(userId) {
  const sql = `
    SELECT user_id, first_name, last_name, email, role
    FROM users
    WHERE user_id = $1
  `;

  const result = await pool.query(sql, [userId]);

  return result.rows[0];
}