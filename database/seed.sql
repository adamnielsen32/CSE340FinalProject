INSERT INTO users (first_name, last_name, email, password_hash, role)
VALUES
  ('Olivia', 'Owner', 'owner@example.com', '$2b$10$2PPYfWTQ2QPLsXGolwWgJ.LxHgALmCASEoK4jiiGOB6LTBXRTiGa2', 'owner'),
  ('Eli', 'Employee', 'employee@example.com', '$2b$10$2PPYfWTQ2QPLsXGolwWgJ.LxHgALmCASEoK4jiiGOB6LTBXRTiGa2', 'employee'),
  ('Casey', 'Customer', 'customer@example.com', '$2b$10$2PPYfWTQ2QPLsXGolwWgJ.LxHgALmCASEoK4jiiGOB6LTBXRTiGa2', 'customer');

INSERT INTO categories (category_name, description)
VALUES
  ('Cars', 'Fuel-efficient sedans and coupes for daily driving.'),
  ('Trucks', 'Work-ready pickups with towing and hauling capability.'),
  ('SUVs', 'Flexible passenger and cargo vehicles for families and adventures.'),
  ('Vans', 'Passenger and cargo vans for business or larger groups.');

INSERT INTO vehicles (
  category_id, vin, year, make, model, trim, mileage, price, color,
  transmission, fuel_type, description, is_featured, is_available
)
VALUES
  (1, '1HGBH41JXMN109186', 2021, 'Honda', 'Accord', 'EX-L', 31240, 23995.00, 'Silver', 'Automatic', 'Gasoline', 'A comfortable sedan with strong fuel economy, leather seating, and modern safety features.', TRUE, TRUE),
  (2, '1FTFW1E50MFA12345', 2022, 'Ford', 'F-150', 'XLT', 28410, 38995.00, 'Blue', 'Automatic', 'Gasoline', 'A dependable crew cab truck with four-wheel drive and a practical towing package.', TRUE, TRUE),
  (3, '5NMS3CADXLH234567', 2020, 'Hyundai', 'Santa Fe', 'SEL', 42100, 21995.00, 'White', 'Automatic', 'Gasoline', 'A roomy SUV with all-wheel drive, driver-assist technology, and excellent cargo space.', TRUE, TRUE),
  (4, '2C4RC1BGXMR345678', 2021, 'Chrysler', 'Pacifica', 'Touring L', 36750, 27995.00, 'Black', 'Automatic', 'Gasoline', 'A family-friendly van with flexible seating, power doors, and a smooth ride.', FALSE, TRUE);

INSERT INTO vehicle_images (vehicle_id, image_url, alt_text, is_primary, display_order)
VALUES
  (1, '/images/vehicles/honda-accord.svg', 'Silver 2021 Honda Accord EX-L', TRUE, 1),
  (2, '/images/vehicles/ford-f150.svg', 'Blue 2022 Ford F-150 XLT', TRUE, 1),
  (3, '/images/vehicles/hyundai-santa-fe.svg', 'White 2020 Hyundai Santa Fe SEL', TRUE, 1),
  (4, '/images/vehicles/chrysler-pacifica.svg', 'Black 2021 Chrysler Pacifica Touring L', TRUE, 1);

INSERT INTO reviews (vehicle_id, user_id, rating, title, body)
VALUES
  (1, 3, 5, 'Great test drive', 'The Accord was clean, comfortable, and exactly as described.'),
  (3, 3, 4, 'Helpful staff', 'The SUV had plenty of space and the team answered all of my questions.');

INSERT INTO service_requests (
  user_id, vehicle_id, customer_vehicle_year, customer_vehicle_make,
  customer_vehicle_model, service_type, description, preferred_date, status
)
VALUES
  (3, 1, 2021, 'Honda', 'Accord', 'Oil change', 'Please complete a standard oil change and fluid check.', CURRENT_DATE + INTERVAL '3 days', 'submitted'),
  (3, NULL, 2018, 'Toyota', 'Camry', 'Inspection', 'Annual inspection and brake check before a road trip.', CURRENT_DATE + INTERVAL '7 days', 'in_progress');

INSERT INTO service_status_history (service_request_id, changed_by_user_id, old_status, new_status, note)
VALUES
  (1, 3, NULL, 'submitted', 'Customer submitted the request.'),
  (2, 3, NULL, 'submitted', 'Customer submitted the request.'),
  (2, 2, 'submitted', 'in_progress', 'Employee started the inspection.');

INSERT INTO contact_messages (user_id, name, email, phone, subject, message, status)
VALUES
  (3, 'Casey Customer', 'customer@example.com', '555-0100', 'Question about financing', 'I would like to know what financing options are available for the Santa Fe.', 'received');

INSERT INTO system_activity (actor_user_id, activity_type, description)
VALUES
  (1, 'seed', 'Initial owner account, inventory, reviews, service requests, and contact message were loaded.');
