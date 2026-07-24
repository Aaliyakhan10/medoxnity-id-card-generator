# Employee ID Card Generator

A full-stack application to create, manage, and print Employee ID cards. The application supports a live preview of the ID card while filling out the form, and allows downloading the card as a high-quality PDF or printing it.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, React Hook Form, Zod.
- **Backend:** Node.js, Express.js.
- **Database & ORM:** PostgreSQL (via Supabase), Prisma.
- **Storage:** Supabase Storage (for employee photos).

## Project Structure
- `frontend/`: React application.
- `backend/`: Express server and APIs.
- `prisma/`: Database schema and configuration.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- A Supabase account and project.

### 2. Environment Variables
1. Rename `.env.example` in the root directory to `.env`.
2. Open `.env` and fill in your Supabase details:
   - `DATABASE_URL`: Connection pooling string for PostgreSQL from Supabase Database settings.
   - `SUPABASE_URL`: Project URL from Supabase API settings.
   - `SUPABASE_ANON_KEY`: Anon key from Supabase API settings.

### 3. Database Setup (Supabase)
1. In your Supabase project, go to **Storage** and create a new public bucket named `employee-photos`. Ensure public policies are enabled for reads and inserts.
2. Open your terminal in the project root and install Prisma globally if you haven't: `npm install -g prisma`
3. Generate Prisma client and push schema to DB:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### 4. Running the Backend
1. Open a terminal and navigate to the `backend/` folder.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
   - Ensure you add a `"dev": "ts-node-dev src/index.ts"` or use `nodemon` in your backend `package.json` scripts if not already present. For this project, you can simply run `npx nodemon src/index.ts`.

### 5. Running the Frontend
1. Open another terminal and navigate to the `frontend/` folder.
2. Install dependencies: `npm install`
3. Start the Vite server: `npm run dev`
4. The application will be available at `http://localhost:5173`.

## Features
- Create new employees with photo upload.
- Live, dynamic ID card preview.
- View employee history.
- Edit and delete existing employee records.
- Download ID cards as high-quality PDFs.
- Direct printing functionality.
