import pool from "../utilities/database.js";

export async function createContactMessage(userId, data) {
  const result = await pool.query(`
    INSERT INTO contact_messages (user_id, name, email, phone, subject, message)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING contact_message_id, status, created_at
  `, [userId || null, data.name, data.email, data.phone || null, data.subject, data.message]);

  return result.rows[0];
}

export async function getAllContactMessages() {
  const result = await pool.query(`
    SELECT cm.*, u.first_name AS account_first_name, u.last_name AS account_last_name
    FROM contact_messages cm
    LEFT JOIN users u ON u.user_id = cm.user_id
    ORDER BY cm.created_at DESC
  `);

  return result.rows;
}
