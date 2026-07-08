import pool from "../utilities/database.js";

const vehicleSelect = `
  SELECT v.*, c.category_name,
    (SELECT vi.image_url FROM vehicle_images vi
      WHERE vi.vehicle_id = v.vehicle_id
      ORDER BY vi.is_primary DESC, vi.display_order, vi.image_id LIMIT 1) AS image_url,
    (SELECT vi.alt_text FROM vehicle_images vi
      WHERE vi.vehicle_id = v.vehicle_id
      ORDER BY vi.is_primary DESC, vi.display_order, vi.image_id LIMIT 1) AS image_alt,
    (SELECT ROUND(AVG(r.rating)::numeric, 1)
      FROM reviews r WHERE r.vehicle_id = v.vehicle_id) AS average_rating,
    (SELECT COUNT(*)::int
      FROM reviews r WHERE r.vehicle_id = v.vehicle_id) AS review_count
  FROM vehicles v
  JOIN categories c ON c.category_id = v.category_id`;

export async function getAllVehicles() {
  const result = await pool.query(`${vehicleSelect} WHERE v.is_available = TRUE ORDER BY v.year DESC, v.make, v.model`);
  return result.rows;
}

export async function getCategories() {
  const result = await pool.query(`SELECT c.*, COUNT(v.vehicle_id)::int AS vehicle_count
    FROM categories c LEFT JOIN vehicles v ON v.category_id = c.category_id AND v.is_available = TRUE
    GROUP BY c.category_id ORDER BY c.category_name`);
  return result.rows;
}

export async function getCategoryById(categoryId) {
  const result = await pool.query("SELECT * FROM categories WHERE category_id = $1", [categoryId]);
  return result.rows[0];
}

export async function getVehiclesByCategory(categoryId) {
  const result = await pool.query(`${vehicleSelect} WHERE v.is_available = TRUE AND v.category_id = $1 ORDER BY v.year DESC, v.make, v.model`, [categoryId]);
  return result.rows;
}

export async function getVehicleById(vehicleId) {
  const result = await pool.query(`${vehicleSelect} WHERE v.vehicle_id = $1`, [vehicleId]);
  return result.rows[0];
}
