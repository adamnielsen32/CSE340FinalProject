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

export async function getAllVehiclesForAdmin() {
  const result = await pool.query(`${vehicleSelect} ORDER BY v.year DESC, v.make, v.model`);
  return result.rows;
}

export async function getCategories() {
  const result = await pool.query(`SELECT c.*, COUNT(v.vehicle_id)::int AS vehicle_count
    FROM categories c LEFT JOIN vehicles v ON v.category_id = c.category_id AND v.is_available = TRUE
    GROUP BY c.category_id ORDER BY c.category_name`);
  return result.rows;
}

export async function getCategoriesForAdmin() {
  const result = await pool.query(`SELECT c.*, COUNT(v.vehicle_id)::int AS vehicle_count
    FROM categories c LEFT JOIN vehicles v ON v.category_id = c.category_id
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

export async function createVehicle(data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const vehicleResult = await client.query(`
      INSERT INTO vehicles (
        category_id, vin, year, make, model, trim, mileage, price, color,
        transmission, fuel_type, description, is_featured, is_available
      )
      VALUES ($1, NULLIF($2, ''), $3, $4, $5, NULLIF($6, ''), $7, $8, NULLIF($9, ''),
        NULLIF($10, ''), NULLIF($11, ''), $12, $13, $14)
      RETURNING vehicle_id
    `, [
      data.categoryId,
      data.vin,
      data.year,
      data.make,
      data.model,
      data.trim,
      data.mileage,
      data.price,
      data.color,
      data.transmission,
      data.fuelType,
      data.description,
      data.isFeatured,
      data.isAvailable,
    ]);

    const vehicleId = vehicleResult.rows[0].vehicle_id;

    if (data.imageUrl) {
      await client.query(`
        INSERT INTO vehicle_images (vehicle_id, image_url, alt_text, is_primary, display_order)
        VALUES ($1, $2, $3, TRUE, 1)
      `, [vehicleId, data.imageUrl, data.imageAlt || `${data.year} ${data.make} ${data.model}`]);
    }

    await client.query("COMMIT");
    return vehicleId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateVehicle(vehicleId, data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      UPDATE vehicles
      SET category_id = $1,
          vin = NULLIF($2, ''),
          year = $3,
          make = $4,
          model = $5,
          trim = NULLIF($6, ''),
          mileage = $7,
          price = $8,
          color = NULLIF($9, ''),
          transmission = NULLIF($10, ''),
          fuel_type = NULLIF($11, ''),
          description = $12,
          is_featured = $13,
          is_available = $14
      WHERE vehicle_id = $15
    `, [
      data.categoryId,
      data.vin,
      data.year,
      data.make,
      data.model,
      data.trim,
      data.mileage,
      data.price,
      data.color,
      data.transmission,
      data.fuelType,
      data.description,
      data.isFeatured,
      data.isAvailable,
      vehicleId,
    ]);

    if (data.imageUrl) {
      const imageResult = await client.query(`
        UPDATE vehicle_images
        SET image_url = $1, alt_text = $2, is_primary = TRUE, display_order = 1
        WHERE image_id = (
          SELECT image_id FROM vehicle_images
          WHERE vehicle_id = $3
          ORDER BY is_primary DESC, display_order, image_id
          LIMIT 1
        )
        RETURNING image_id
      `, [data.imageUrl, data.imageAlt || `${data.year} ${data.make} ${data.model}`, vehicleId]);

      if (!imageResult.rowCount) {
        await client.query(`
          INSERT INTO vehicle_images (vehicle_id, image_url, alt_text, is_primary, display_order)
          VALUES ($1, $2, $3, TRUE, 1)
        `, [vehicleId, data.imageUrl, data.imageAlt || `${data.year} ${data.make} ${data.model}`]);
      }
    } else {
      await client.query("DELETE FROM vehicle_images WHERE vehicle_id = $1", [vehicleId]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteVehicle(vehicleId) {
  const result = await pool.query("DELETE FROM vehicles WHERE vehicle_id = $1 RETURNING vehicle_id", [vehicleId]);
  return result.rowCount > 0;
}

export async function createCategory(data) {
  const result = await pool.query(`
    INSERT INTO categories (category_name, description)
    VALUES ($1, NULLIF($2, ''))
    RETURNING category_id
  `, [data.categoryName, data.description]);

  return result.rows[0].category_id;
}

export async function updateCategory(categoryId, data) {
  const result = await pool.query(`
    UPDATE categories
    SET category_name = $1, description = NULLIF($2, '')
    WHERE category_id = $3
    RETURNING category_id
  `, [data.categoryName, data.description, categoryId]);

  return result.rowCount > 0;
}

export async function deleteCategory(categoryId) {
  const result = await pool.query("DELETE FROM categories WHERE category_id = $1 RETURNING category_id", [categoryId]);
  return result.rowCount > 0;
}
