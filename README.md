# Hospital Queue System - Complete Setup Guide

## 📁 Project Structure

Create this folder structure in your NestJS project:

```
src/
  hospital-queue/
    ├── dto/
    │   ├── create-queue.dto.ts
    │   ├── update-priority.dto.ts
    │   └── queue-response.dto.ts
    ├── hospital-queue.schema.ts
    ├── hospital-queue.service.ts
    ├── hospital-queue.controller.ts
    └── hospital-queue.module.ts
```

## 🚀 Installation

### 1. Install Required Dependencies

```bash
npm install @nestjs/mongoose mongoose
npm install class-validator class-transformer
```

### 2. Configure MongoDB Connection

In your `app.module.ts`:

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

### 3. Enable Validation Globally

In your `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
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

## 📡 API Endpoints Reference

### 1. Add Patient to Queue

```bash
POST /queue
Content-Type: application/json

{
  "hospital_id": "507f1f77bcf86cd799439011",
  "doctor_id": "507f1f77bcf86cd799439012",
  "patient_user_id": "507f1f77bcf86cd799439013",
  "patient_diagnosis_report_id": "507f1f77bcf86cd799439014",
  "priority_level": 7
}
```

**Response:**

```json
{
  "success": true,
  "message": "Patient added to queue successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "hospital_id": "507f1f77bcf86cd799439011",
    "doctor_id": "507f1f77bcf86cd799439012",
    "patient_user_id": "507f1f77bcf86cd799439013",
    "patient_diagnosis_report_id": "507f1f77bcf86cd799439014",
    "queue_order": 3,
    "priority_level": 7,
    "created_at": "2025-11-28T10:30:00.000Z",
    "updated_at": "2025-11-28T10:30:00.000Z"
  }
}
```

### 2. Get Doctor's Queue

```bash
GET /queue/doctor/507f1f77bcf86cd799439012
```

**Response:**

```json
{
  "success": true,
  "message": "Doctor queue retrieved successfully",
  "data": [
    {
      "_id": "...",
      "queue_order": 1,
      "priority_level": 10,
      "patient_user_id": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      ...
    }
  ],
  "count": 5
}
```

### 3. Get Patient Position

```bash
GET /queue/position/507f1f77bcf86cd799439013/507f1f77bcf86cd799439012
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

### 4. Update Priority

```bash
PATCH /queue/507f1f77bcf86cd799439015/priority
Content-Type: application/json

{
  "priority_level": 10
}
```

### 5. Remove from Queue

```bash
DELETE /queue/507f1f77bcf86cd799439015
```

### 6. Get Hospital Queue

```bash
GET /queue/hospital/507f1f77bcf86cd799439011
```

### 7. Clear Doctor's Queue

```bash
DELETE /queue/doctor/507f1f77bcf86cd799439012/clear
```

### 8. Get Single Queue Entry

```bash
GET /queue/507f1f77bcf86cd799439015
```

## 🧪 Testing with Postman/Thunder Client

### Example Flow:

1. **Add 3 patients** with different priorities:
   - Patient A: priority 5
   - Patient B: priority 8
   - Patient C: priority 3

2. **Get doctor's queue** - Should be ordered: B (8), A (5), C (3)

3. **Check Patient C's position** - Should be 3rd

4. **Update Patient C to priority 10** (emergency)

5. **Get queue again** - Now ordered: C (10), B (8), A (5)

## ⚠️ Important Notes

### Priority Levels (1-10):

- **1-3**: Low priority (routine checkup)
- **4-6**: Medium priority (follow-up)
- **7-8**: High priority (sick/in pain)
- **9-10**: Critical (emergency)
