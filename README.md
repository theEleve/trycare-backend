Diagnosis Report Management API

A backend API built with NestJS and MongoDB to manage diagnosis reports, providing endpoints for creating, retrieving, and updating medical diagnosis reports.

Table of Contents

Project Overview

Features

Technologies Used

Getting Started

Environment Variables

Running the Application

API Endpoints

Testing

License

Project Overview

This project is a RESTful API that supports managing diagnosis reports in a healthcare context. It allows creation, retrieval by report ID or patient, and updating of doctor feedback for reports. The backend is built using NestJS and uses MongoDB as the database.

Features

Create new diagnosis reports

Fetch diagnosis report by ID

Fetch diagnosis reports by patient ID

Update doctor feedback on a diagnosis report

Health check endpoint to monitor MongoDB connection status

Technologies Used

NestJS
 — Node.js framework for building scalable server-side applications

TypeScript
 — Typed JavaScript superset

MongoDB
 — NoSQL database

Mongoose
 — MongoDB object modeling

ESLint
 & Prettier
 — Code linting and formatting

Jest
 — Testing framework

Getting Started
Prerequisites

Node.js (v18 or later recommended)

npm or yarn

MongoDB Atlas account or local MongoDB instance

Installation

Clone the repository

git clone https://github.com/yourusername/diagnosis-report-management.git
cd diagnosis-report-management


Install dependencies

npm install
# or
yarn install


Configure environment variables

Create a .env file at the root with the following variables:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
PORT=3000

Running the Application

Start the development server:

npm run start:dev


The API will be available at http://localhost:3000/

API Endpoints
Method	Endpoint	Description
POST	/diagnosis-report	Create a new diagnosis report
GET	/diagnosis-report/:id	Get a diagnosis report by ID
GET	/diagnosis-report/patient/:patientUserId	Get diagnosis reports for a patient
PATCH	/diagnosis-report/feedback/:id	Update doctor feedback for a report
GET	/health/db	Check MongoDB connection status
Testing

Run the unit tests:

npm run test

License

This project is licensed under the MIT License.

For further enquiries contact:
austinibe15@gmail.com