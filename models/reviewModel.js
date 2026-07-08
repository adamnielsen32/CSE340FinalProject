import pool from "../utilities/database.js";

export async function getReviewsByVehicle(vehicleId) {
  const result = await pool.query(`
    SELECT r.*, u.first_name, u.last_name
    FROM reviews r
    JOIN users u ON u.user_id = r.user_id
    WHERE r.vehicle_id = $1
    ORDER BY r.created_at DESC
  `, [vehicleId]);
  return result.rows;
}

export async function createReview(vehicleId, userId, rating, title, body) {
  const result = await pool.query(`
    INSERT INTO reviews (vehicle_id, user_id, rating, title, body)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [vehicleId, userId, rating, title || null, body]);
  return result.rows[0];
}

export async function deleteReview(reviewId, userId, role) {
  const result = await pool.query(`
    DELETE FROM reviews
    WHERE review_id = $1
      AND (user_id = $2 OR $3 IN ('employee', 'owner'))
    RETURNING review_id, vehicle_id
  `, [reviewId, userId, role]);
  return result.rows[0];
}
