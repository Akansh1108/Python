# Parking Admin Dashboard

This directory contains a simple React-based admin dashboard for managing parking lots, slots and bookings. It uses CDN links so no build step is required.

## How to run

Open `public/index.html` in a browser. The application is written with inline JSX using Babel Standalone, so no additional setup is required.

There are two predefined users:

- **admin** / **admin** – full access to add or delete parking lots and view bookings.
- **staff** / **staff** – can view lots and manage bookings but cannot create or delete parking lots.

Parking lots and bookings are stored in memory, so refreshing the page resets the data.
