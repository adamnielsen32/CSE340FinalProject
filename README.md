# Used Car Dealership Final Project

This is my final project for CSE 340. I built a used car dealership web app with public inventory pages, user accounts, service requests, reviews, contact messages, and owner-only inventory management.

The main goal was to make the project feel like a real small dealership app instead of just a set of separate pages. Customers can browse vehicles and interact with the dealership, employees can manage requests/messages, and the owner can manage the inventory.

## What the app does

- Shows a home page with featured vehicles
- Shows public inventory, category, and vehicle detail pages
- Lets users register, log in, and log out
- Supports three roles:
  - customer
  - employee
  - owner
- Lets customers submit and view service requests
- Lets employees and owners manage service request statuses
- Lets visitors send contact messages
- Lets employees and owners view contact messages
- Lets logged-in users leave vehicle reviews
- Lets users delete their own reviews
- Lets employees and owners remove reviews
- Lets owners add, edit, and delete vehicles
- Lets owners add, edit, and delete categories

## Tech used

- Node.js
- Express
- EJS
- PostgreSQL
- Sessions for login/authentication
- bcrypt for password hashing
- pnpm for package management

## Getting started

Install the dependencies:

```bash
pnpm install
```

Set up the database connection in `.env`. This project expects PostgreSQL.

Then run the database setup:

```bash
pnpm run db:setup
```

That command creates the database if needed, runs `database/schema.sql`, and loads the starter data from `database/seed.sql`.

Start the app:

```bash
pnpm start
```

For development, I usually use:

```bash
pnpm run dev
```

## Seeded test accounts

All seeded accounts use this password:

```text
P@$$w0rd!
```

Accounts:

- Owner: `owner@example.com`
- Employee: `employee@example.com`
- Customer: `customer@example.com`

## Main pages to test

- `/` - home page with featured vehicles
- `/inventory` - all available vehicles
- `/contact` - contact form
- `/service/new` - submit a service request
- `/service/history` - customer service request history
- `/admin/service-requests` - employee/owner service management
- `/admin/contact-messages` - employee/owner contact messages
- `/admin/vehicles` - owner vehicle CRUD
- `/admin/categories` - owner category CRUD


