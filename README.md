# TryCare Backend - AI Medical Diagnosis & Hospital Queue System

AI-powered medical triage, diagnosis report management, and hospital queue system using NestJS, MongoDB, and Google Gemini AI.

## 🎯 Overview

TryCare is a comprehensive healthcare management platform combining:

- **AI-Powered Diagnosis**: Using Google Gemini AI for medical triage
- **Hospital Queue Management**: Priority-based patient queuing system
- **Report Management**: Complete diagnosis report tracking
- **Authentication**: JWT-based auth for patients and doctors

---

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file in project root:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=7d
```

Get your Gemini API key: https://aistudio.google.com/app/apikey

### 3. Start Server

```bash
npm run start:dev
```

Server runs on `http://localhost:3000`

---

## ✨ Features

### 1. AI Diagnosis

- Symptom analysis using Google Gemini AI
- Severity scoring (0-100)
- Treatment recommendations
- Diagnosis reasoning

### 2. Hospital Queue Management

- Priority-based queuing (1-10 scale)
- Automatic position tracking
- Wait time estimation
- Duplicate prevention
- Real-time updates

### 3. Diagnosis Reports

- Create and manage patient reports
- Doctor feedback integration
- Report history tracking

### 4. Authentication & Authorization

- JWT-based authentication
- Role-based access (patient, doctor, admin)
- Secure password hashing with bcrypt

---

## 📡 API Endpoints

### AI Diagnosis

| Method | Endpoint            | Description                       |
| ------ | ------------------- | --------------------------------- |
| POST   | `/ai/diagnose`      | Direct AI diagnosis (development) |
| POST   | `/diagnosis/submit` | Submit diagnosis with AI analysis |

### Queue Management

| Method | Endpoint                                 | Description           |
| ------ | ---------------------------------------- | --------------------- |
| POST   | `/queue`                                 | Add patient to queue  |
| GET    | `/queue/doctor/:doctor_id`               | Get doctor's queue    |
| GET    | `/queue/hospital/:hospital_id`           | Get hospital queue    |
| GET    | `/queue/position/:patient_id/:doctor_id` | Get patient position  |
| PATCH  | `/queue/:queue_id/priority`              | Update priority level |
| DELETE | `/queue/:queue_id`                       | Remove from queue     |
| DELETE | `/queue/doctor/:doctor_id/clear`         | Clear doctor queue    |

### Diagnosis Reports

| Method | Endpoint                                   | Description            |
| ------ | ------------------------------------------ | ---------------------- |
| POST   | `/diagnosis-report`                        | Create new report      |
| GET    | `/diagnosis-report/:id`                    | Get report by ID       |
| GET    | `/diagnosis-report/patient/:patientUserId` | Get patient's reports  |
| PATCH  | `/diagnosis-report/feedback/:id`           | Update doctor feedback |

### Health Check

| Method | Endpoint     | Description              |
| ------ | ------------ | ------------------------ |
| GET    | `/health/db` | Check MongoDB connection |

---

## 🔌 Using AI Service

### Import AIModule

```typescript
import { Module } from '@nestjs/common';
import { AIModule } from '../ai/ai.module';
import { YourService } from './your.service';

@Module({
  imports: [AIModule],
  providers: [YourService],
})
export class YourModule {}
```

### Call AIService

```typescript
import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';

@Injectable()
export class YourService {
  constructor(private readonly aiService: AIService) {}

  async analyzeSymptoms() {
    const result = await this.aiService.generateDiagnosis({
      disease: 'Malaria',
      symptoms: {
        feverPresence: 'Yes',
        feverDuration: '3 days',
        bodyWeakness: 'Moderate',
      },
    });

    return result; // { suggestedDiagnosis, severityRank, managementTips, severityScore }
  }
}
```

---

## 🏥 Queue Management

### Add Patient to Queue

```bash
curl -X POST http://localhost:3000/queue \
  -H "Content-Type: application/json" \
  -d '{
    "hospital_id": "673e9b8a1234567890abcdef",
    "doctor_id": "673e9b8a1234567890abcd00",
    "patient_user_id": "673e9b8a1234567890abcd01",
    "patient_diagnosis_report_id": "673e9b8a1234567890abcd02",
    "priority_level": 7
  }'
```

### Priority Level Guide

| Level | Description     | Use Case                    |
| ----- | --------------- | --------------------------- |
| 1-3   | Low Priority    | Routine checkup, follow-up  |
| 4-6   | Medium Priority | Sick but stable             |
| 7-8   | High Priority   | Significant pain/discomfort |
| 9-10  | Critical        | Emergency, life-threatening |

### Wait Time Calculation

- Average consultation time: 15 minutes
- Formula: `position × 15 minutes`

---

## 🗄️ Technologies Used

- **NestJS** — Node.js framework for building scalable server-side applications
- **TypeScript** — Typed JavaScript superset
- **MongoDB** — NoSQL database with Mongoose ODM
- **Google Gemini AI** — AI-powered diagnosis generation
- **JWT** — Authentication and authorization
- **bcrypt** — Password hashing
- **Passport** — Authentication middleware
- **ESLint & Prettier** — Code linting and formatting
- **Jest** — Testing framework

---

## 🧪 Testing

Run the unit tests:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run test:cov
```

---

## 📝 Project Structure

```
src/
├── ai/                 # AI service (Gemini integration)
├── diagnosis/          # Diagnosis orchestration
├── diagnosis-report/   # Report management
├── hospital-queue/     # Queue management
├── hospital/           # Hospital CRUD
├── doctor/            # Doctor management
├── patient/           # Patient management
├── auth/              # Authentication & JWT
├── health/            # Health checks
└── app.module.ts      # Main module
```

---

## 🔧 Environment Variables

| Variable       | Description               | Example                              |
| -------------- | ------------------------- | ------------------------------------ |
| MONGO_URI      | MongoDB connection string | `mongodb+srv://user:pass@cluster...` |
| GEMINI_API_KEY | Google Gemini API key     | `AIza...`                            |
| GEMINI_MODEL   | Gemini model version      | `gemini-2.5-flash`                   |
| PORT           | Server port               | `3000`                               |
| JWT_SECRET     | JWT signing secret        | `your_secret_here`                   |
| JWT_EXPIRATION | JWT expiration time       | `7d`                                 |

---

## 📄 License

UNLICENSED - Private use only

---

## 📞 Contact

For further enquiries contact: austinibe15@gmail.com
