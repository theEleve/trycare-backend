# 🏥 Hospital Queue Management System

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Integration Guide](#integration-guide)
- [Testing](#testing)
- [Team Integration](#team-integration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Hospital Queue Management System manages patient queues for doctors in a hospital environment. It supports priority-based ordering, real-time position tracking, and estimated wait times.

### Key Capabilities

- **Priority-Based Queue**: Patients sorted by urgency (1-10 scale)
- **Automatic Position Management**: Auto-calculates queue positions
- **Wait Time Estimation**: Predicts wait times based on queue position
- **Duplicate Prevention**: Prevents patients from joining same queue twice
- **RESTful API**: 8 endpoints for complete queue management

---

## ✨ Features

### 1. **Add Patient to Queue**

- Validates patient data
- Checks for duplicates
- Assigns queue position automatically
- Supports priority levels 1-10

### 2. **View Queue**

- Get queue by doctor
- Get queue by hospital
- View single queue entry
- Automatic sorting by priority and order

### 3. **Track Position**

- Real-time position updates
- Total patients in queue
- Estimated wait time calculation

### 4. **Manage Priority**

- Update patient priority (for emergencies)
- Queue auto-reorders on next fetch

### 5. **Queue Operations**

- Remove patient from queue
- Clear entire doctor queue
- Bulk operations support

---

## 🏗️ Architecture

### NestJS Module Structure

```
hospital-queue/
├── dto/                          # Data Transfer Objects (Input Validation)
│   ├── create-queue.dto.ts
│   └── update-priority.dto.ts
├── temporary-schemas/            # Stub schemas (DELETE after integration)
│   └── stub-schemas.ts
├── hospital-queue.schema.ts      # MongoDB Schema
├── hospital-queue.service.ts     # Business Logic
├── hospital-queue.controller.ts  # API Endpoints
└── hospital-queue.module.ts      # Module Configuration
```

### Components Explained

| Component      | Role                            | Analogy                |
| -------------- | ------------------------------- | ---------------------- |
| **Controller** | Handles HTTP requests/responses | Waiter taking orders   |
| **Service**    | Contains business logic         | Kitchen preparing food |
| **Schema**     | Defines database structure      | Menu template          |
| **DTO**        | Validates incoming data         | Bouncer checking IDs   |
| **Module**     | Ties everything together        | Restaurant manager     |

---

## 🚀 Installation

### Prerequisites

- Node.js (v16+)
- MongoDB (v5+)
- npm or yarn

### Step 1: Install Dependencies

```bash
npm install @nestjs/mongoose mongoose class-validator class-transformer
```

### Step 2: Project Structure

Create the following structure in your NestJS project:

```
src/
  hospital-queue/
    ├── dto/
    │   ├── create-queue.dto.ts
    │   └── update-priority.dto.ts
    ├── temporary-schemas/
    │   └── stub-schemas.ts
    ├── hospital-queue.schema.ts
    ├── hospital-queue.service.ts
    ├── hospital-queue.controller.ts
    └── hospital-queue.module.ts
```

### Step 3: Configure MongoDB

Update `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HospitalQueueModule } from './hospital-queue/hospital-queue.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/hospital-db'),
    HospitalQueueModule,
  ],
})
export class AppModule {}
```

### Step 4: Enable Global Validation

Update `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

### Step 5: Run the Application

```bash
npm run start:dev
```

Server will start on `http://localhost:3000`

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000/queue
```

---

### 1. Add Patient to Queue

**Endpoint:** `POST /queue`

**Description:** Adds a new patient to the doctor's queue with specified priority.

**Request Body:**

```json
{
  "hospital_id": "673e9b8a1234567890abcdef",
  "doctor_id": "673e9b8a1234567890abcd00",
  "patient_user_id": "673e9b8a1234567890abcd01",
  "patient_diagnosis_report_id": "673e9b8a1234567890abcd02",
  "priority_level": 7
}
```

**Validation Rules:**

- All IDs must be valid MongoDB ObjectIds (24 hex characters)
- `priority_level` must be between 1-10

**Response:**

```json
{
  "success": true,
  "message": "Patient added to queue successfully",
  "data": {
    "_id": "673e9b8a1234567890abcd03",
    "hospital_id": "673e9b8a1234567890abcdef",
    "doctor_id": "673e9b8a1234567890abcd00",
    "patient_user_id": "673e9b8a1234567890abcd01",
    "patient_diagnosis_report_id": "673e9b8a1234567890abcd02",
    "queue_order": 1,
    "priority_level": 7,
    "created_at": "2025-11-28T10:30:00.000Z",
    "updated_at": "2025-11-28T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid data or patient already in queue
- `422 Unprocessable Entity`: Validation failed

---

### 2. Get Doctor's Queue

**Endpoint:** `GET /queue/doctor/:doctor_id`

**Description:** Retrieves all patients in queue for a specific doctor, sorted by priority and order.

**Example:**

```
GET /queue/doctor/673e9b8a1234567890abcd00
```

**Response:**

```json
{
  "success": true,
  "message": "Doctor queue retrieved successfully",
  "data": [
    {
      "_id": "673e9b8a1234567890abcd03",
      "queue_order": 1,
      "priority_level": 10,
      "patient_user_id": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+234-XXX-XXXX"
      },
      "patient_diagnosis_report_id": {
        "diagnosis": "Severe headache",
        "severity_score": 8,
        "symptoms": ["headache", "nausea"]
      }
    }
  ],
  "count": 1
}
```

**Sorting Logic:**

1. Primary: Priority (highest first)
2. Secondary: Queue order (earliest first)

---

### 3. Get Hospital Queue

**Endpoint:** `GET /queue/hospital/:hospital_id`

**Description:** Retrieves all queues across all doctors in a hospital.

**Example:**

```
GET /queue/hospital/673e9b8a1234567890abcdef
```

**Response:** Similar to doctor queue but includes doctor information.

---

### 4. Get Patient Position

**Endpoint:** `GET /queue/position/:patient_user_id/:doctor_id`

**Description:** Gets a patient's current position in queue with wait time estimate.

**Example:**

```
GET /queue/position/673e9b8a1234567890abcd01/673e9b8a1234567890abcd00
```

**Response:**

```json
{
  "success": true,
  "message": "Patient position retrieved successfully",
  "data": {
    "position": 3,
    "total_in_queue": 8,
    "estimated_wait_time": "45 minutes"
  }
}
```

**Wait Time Calculation:**

- Average consultation time: 15 minutes
- Formula: `position × 15 minutes`
- Displays in hours/minutes format

---

### 5. Get Single Queue Entry

**Endpoint:** `GET /queue/:queue_id`

**Description:** Retrieves details of a specific queue entry.

**Example:**

```
GET /queue/673e9b8a1234567890abcd03
```

---

### 6. Update Priority

**Endpoint:** `PATCH /queue/:queue_id/priority`

**Description:** Updates the priority level of a queue entry (for emergencies).

**Request Body:**

```json
{
  "priority_level": 10
}
```

**Response:**

```json
{
  "success": true,
  "message": "Priority updated successfully",
  "data": {
    "_id": "673e9b8a1234567890abcd03",
    "priority_level": 10,
    ...
  }
}
```

---

### 7. Remove from Queue

**Endpoint:** `DELETE /queue/:queue_id`

**Description:** Removes a patient from the queue (after consultation).

**Example:**

```
DELETE /queue/673e9b8a1234567890abcd03
```

**Response:**

```json
{
  "success": true,
  "message": "Patient removed from queue successfully"
}
```

---

### 8. Clear Doctor Queue

**Endpoint:** `DELETE /queue/doctor/:doctor_id/clear`

**Description:** Removes all patients from a doctor's queue.

**Example:**

```
DELETE /queue/doctor/673e9b8a1234567890abcd00/clear
```

**Response:**

```json
{
  "success": true,
  "message": "Queue cleared successfully",
  "deleted_count": 5
}
```

---

## 🗄️ Database Schema

### HospitalQueue Collection

```typescript
{
  _id: ObjectId,                          // Auto-generated
  hospital_id: ObjectId,                  // Reference to Hospital
  doctor_id: ObjectId,                    // Reference to Doctor
  patient_user_id: ObjectId,              // Reference to User
  patient_diagnosis_report_id: ObjectId,  // Reference to DiagnosisReport
  queue_order: Number,                    // Position in queue (1, 2, 3...)
  priority_level: Number,                 // 1-10 (10 = highest)
  created_at: Date,                       // Auto-generated
  updated_at: Date                        // Auto-updated
}
```

### Indexes

```typescript
// Compound index for fast queue queries
{ doctor_id: 1, priority_level: -1, queue_order: 1 }

// Index for duplicate checking
{ patient_user_id: 1, doctor_id: 1 }
```

### Priority Level Guide

| Level | Description     | Use Case                         |
| ----- | --------------- | -------------------------------- |
| 1-3   | Low Priority    | Routine checkup, follow-up       |
| 4-6   | Medium Priority | Sick but stable, scheduled visit |
| 7-8   | High Priority   | Significant pain/discomfort      |
| 9-10  | Critical        | Emergency, life-threatening      |

---

## 🔌 Integration Guide

### Current State (Temporary Setup)

The system currently uses **stub schemas** for Doctor, User, Hospital, and DiagnosisReport. This allows independent development.

**File:** `temporary-schemas/stub-schemas.ts`

### Integration Steps (When Teams Are Ready)

#### Step 1: Get Schema Locations

Ask each team for their schema file paths:

```typescript
// Example team responses:
Doctor Team:     "src/doctor/schemas/doctor.schema.ts"
User Team:       "src/user/schemas/user.schema.ts"
Hospital Team:   "src/hospital/schemas/hospital.schema.ts"
Diagnosis Team:  "src/diagnosis/schemas/diagnosis-report.schema.ts"
```

#### Step 2: Update Module Imports

**BEFORE (Current):**

```typescript
// hospital-queue.module.ts
import {
  Doctor,
  DoctorSchema,
  User,
  UserSchema,
} from './temporary-schemas/stub-schemas';
```

**AFTER (Production):**

```typescript
// hospital-queue.module.ts
import { Doctor, DoctorSchema } from '../doctor/schemas/doctor.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Hospital, HospitalSchema } from '../hospital/schemas/hospital.schema';
import {
  DiagnosisReport,
  DiagnosisReportSchema,
} from '../diagnosis/schemas/diagnosis-report.schema';
```

#### Step 3: Update Module Registration

Keep the same `MongooseModule.forFeature()` registration, just with real schemas:

```typescript
MongooseModule.forFeature([
  { name: HospitalQueue.name, schema: HospitalQueueSchema },
  { name: Doctor.name, schema: DoctorSchema },           // Now real
  { name: User.name, schema: UserSchema },               // Now real
  { name: Hospital.name, schema: HospitalSchema },       // Now real
  { name: DiagnosisReport.name, schema: DiagnosisReportSchema }, // Now real
]),
```

#### Step 4: Delete Temporary Files

```bash
rm -rf src/hospital-queue/temporary-schemas/
```

#### Step 5: Test Integration

```bash
# Restart server
npm run start:dev

# Test queue with populated data
curl http://localhost:3000/queue/doctor/673e9b8a1234567890abcd00
```

---

## 🧪 Testing

### Using Postman

#### Test Scenario: Emergency Patient

1. **Add 3 regular patients** (priority 5)
2. **Check queue** - should see 3 patients
3. **Add emergency patient** (priority 10)
4. **Check queue again** - emergency should be first
5. **Get emergency patient position** - should be position 1
6. **Remove emergency patient**
7. **Verify queue** - back to 3 patients

### Postman Collection

Import this collection for quick testing:

```json
{
  "info": {
    "name": "Hospital Queue API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Add to Queue",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/queue",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"hospital_id\": \"{{hospital_id}}\",\n  \"doctor_id\": \"{{doctor_id}}\",\n  \"patient_user_id\": \"{{patient_id}}\",\n  \"patient_diagnosis_report_id\": \"{{diagnosis_id}}\",\n  \"priority_level\": 7\n}"
        }
      }
    }
  ]
}
```

### Environment Variables

```
base_url = http://localhost:3000
hospital_id = 673e9b8a1234567890abcdef
doctor_id = 673e9b8a1234567890abcd00
patient_id = 673e9b8a1234567890abcd01
diagnosis_id = 673e9b8a1234567890abcd02
```

---

## 👥 Team Integration

### For Doctor Service Team

**What we need from you:**

```typescript
// Schema location
src / doctor / schemas / doctor.schema.ts;

// Exported classes
export { Doctor, DoctorSchema };

// Fields we'll populate
interface Doctor {
  _id: ObjectId;
  name: string;
  specialization: string;
  email: string;
}
```

### For User Service Team

**What we need from you:**

```typescript
// Schema location
src / user / schemas / user.schema.ts;

// Exported classes
export { User, UserSchema };

// Fields we'll populate
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  phone?: string;
}
```

### For Hospital Service Team

**What we need from you:**

```typescript
// Schema location
src / hospital / schemas / hospital.schema.ts;

// Exported classes
export { Hospital, HospitalSchema };

// Fields we'll populate
interface Hospital {
  _id: ObjectId;
  name: string;
  address: string;
}
```

### For Diagnosis Service Team

**What we need from you:**

```typescript
// Schema location
src / diagnosis / schemas / diagnosis - report.schema.ts;

// Exported classes
export { DiagnosisReport, DiagnosisReportSchema };

// Fields we'll populate
interface DiagnosisReport {
  _id: ObjectId;
  diagnosis: string;
  severity_score: number;
  symptoms: string[];
}
```

---

## 🐛 Troubleshooting

### Error: "Schema hasn't been registered for model 'Doctor'"

**Cause:** Other team schemas not yet available.

**Solution:** System falls back gracefully. Returns queue data without populated fields. No action needed until integration.

### Error: "Cast to ObjectId failed"

**Cause:** Invalid ID format sent in request.

**Solution:** Ensure all IDs are valid MongoDB ObjectIds (24 hex characters).

```javascript
// Valid
'673e9b8a1234567890abcdef';

// Invalid
'123';
'abc';
```

### Error: "Patient is already in queue for this doctor"

**Cause:** Attempting to add duplicate queue entry.

**Solution:** Check existing queue before adding. This is a business rule to prevent duplicates.

### Queue not sorting correctly

**Cause:** Priority level not set correctly.

**Solution:** Verify priority is 1-10. Higher numbers = higher priority.

### Populate not working after integration

**Cause:** Schema not exported or wrong import path.

**Solution:**

1. Verify schema exports both class and schema
2. Check import path is correct
3. Ensure schema is registered in module

---

## 📊 Performance Considerations

### Database Indexes

The system uses compound indexes for optimal query performance:

```typescript
// Fast queue retrieval for doctors
{ doctor_id: 1, priority_level: -1, queue_order: 1 }

// Fast duplicate detection
{ patient_user_id: 1, doctor_id: 1 }
```

### Query Optimization

- Uses `.lean()` for read operations (returns plain objects, faster)
- Selective `.populate()` (only fetches needed fields)
- Indexed sorting (no in-memory sorting needed)

---

## 🚀 Future Enhancements

- [ ] WebSocket support for real-time queue updates
- [ ] Queue notifications (SMS/Email)
- [ ] Queue analytics dashboard
- [ ] Multi-specialty support
- [ ] Appointment scheduling integration
- [ ] Queue history and reporting

---

## 📝 API Response Format

All endpoints follow this consistent format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful message",
  "data": {
    /* actual data */
  },
  "count": 10 // Optional: for list endpoints
}
```

**Error Response:**

```json
{
  "statusCode": 400,
  "message": "Error message describing what went wrong",
  "error": "Bad Request"
}
```

---

## 👨‍💻 Developer

**Name:** Detumo Alex  
**Team:** The Eleve - Queue System  
**Framework:** NestJS + MongoDB  
**Date:** November 2025

---

## 📄 License

MIT License - Built for K-TechFest Hackathon

---

## 🙏 Acknowledgments

- NestJS Team for the amazing framework
- MongoDB for reliable database
- Team members for collaboration

---

## 📞 Support

For questions or issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [API Documentation](#api-documentation)
3. Contact team lead: Zainab Musa

---

**Happy Coding! 🚀**
