import pool from "../utilities/database.js";

export async function createServiceRequest(userId, data) {
  const result = await pool.query(`INSERT INTO service_requests
    (user_id, customer_vehicle_year, customer_vehicle_make, customer_vehicle_model, service_type, description, preferred_date)
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [userId, data.vehicleYear || null, data.vehicleMake || null, data.vehicleModel || null, data.serviceType, data.description, data.preferredDate || null]);
  await pool.query(`INSERT INTO service_status_history (service_request_id, changed_by_user_id, old_status, new_status, note)
    VALUES ($1,$2,NULL,'submitted','Customer submitted the request.')`, [result.rows[0].service_request_id, userId]);
  return result.rows[0];
}

const serviceSelect = `SELECT sr.*, u.first_name, u.last_name, u.email,
  COALESCE(v.year, sr.customer_vehicle_year) AS display_year,
  COALESCE(v.make, sr.customer_vehicle_make) AS display_make,
  COALESCE(v.model, sr.customer_vehicle_model) AS display_model
  FROM service_requests sr JOIN users u ON u.user_id = sr.user_id
  LEFT JOIN vehicles v ON v.vehicle_id = sr.vehicle_id`;

export async function getRequestsByUser(userId) {
  const result = await pool.query(`${serviceSelect} WHERE sr.user_id = $1 ORDER BY sr.created_at DESC`, [userId]);
  return result.rows;
}

export async function getAllServiceRequests() {
  const result = await pool.query(`${serviceSelect} ORDER BY sr.created_at DESC`);
  return result.rows;
}

export async function updateServiceStatus(requestId, status, changedBy) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const current = await client.query("SELECT status FROM service_requests WHERE service_request_id = $1 FOR UPDATE", [requestId]);
    if (!current.rows[0]) { await client.query("ROLLBACK"); return null; }
    await client.query("UPDATE service_requests SET status = $1 WHERE service_request_id = $2", [status, requestId]);
    await client.query(`INSERT INTO service_status_history (service_request_id, changed_by_user_id, old_status, new_status, note)
      VALUES ($1,$2,$3,$4,'Status updated by staff.')`, [requestId, changedBy, current.rows[0].status, status]);
    await client.query("COMMIT");
    return true;
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
}
