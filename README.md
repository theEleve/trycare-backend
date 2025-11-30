# TryCare Backend - AI Medical Diagnosis System

AI-powered medical triage and diagnosis report management system using NestJS, MongoDB, and Google Gemini AI.

## Quick Setup

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
```

Get your Gemini API key: https://aistudio.google.com/app/apikey

### 3. Start Server
```bash
npm run start:dev
```

Server runs on `http://localhost:3000`

---

## Testing the AI Orchestration Flow

### Option 1: Test via API Endpoints

#### A. Test AI Service Directly (Development)

**Endpoint:** `POST /ai/diagnose`

**Request:**
```bash
curl -X POST http://localhost:3000/ai/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "disease": "Malaria",
    "symptoms": {
      "feverPresence": "Yes",
      "feverDuration": "3 days",
      "bodyWeakness": "Moderate"
    }
  }'
```

**Response:**
```json
{
  "suggestedDiagnosis": "Possible Malaria infection based on symptoms",
  "severityRank": "Mild",
  "managementTips": [
    "Seek medical evaluation for fever assessment",
    "Get tested for Malaria with RDT or blood smear",
    "Monitor temperature and symptoms"
  ],
  "reasoning": "Fever present for 3 days with moderate weakness suggests possible malaria...",
  "severityScore": 60
}
```

#### B. Test Full Diagnosis Flow (Production)

**Endpoint:** `POST /diagnosis/submit`

**Request:**
```bash
curl -X POST http://localhost:3000/diagnosis/submit \
  -H "Content-Type: application/json" \
  -d '{
    "patientUserId": "patient_12345",
    "disease": "Malaria",
    "symptoms": {
      "feverPresence": "Yes",
      "feverDuration": "5 days",
      "bodyWeakness": "Severe",
      "headache": "Persistent",
      "vomiting": "Yes",
      "travelHistory": "Visited endemic area"
    },
    "additionalNotes": "Patient unable to eat or drink"
  }'
```

**Response:**
```json
{
  "patientUserId": "patient_12345",
  "disease": "Malaria",
  "symptoms": { ... },
  "aiFeedback": {
    "suggestedDiagnosis": "Likely Malaria infection requiring immediate attention",
    "severityRank": "Severe",
    "managementTips": [
      "Seek immediate medical attention",
      "Emergency malaria testing required",
      "Do not delay treatment"
    ],
    "reasoning": "High fever for 5+ days with severe symptoms..."
  },
  "severityScore": 90,
  "modelVersion": "gemini-2.5-flash",
  "submittedAt": "2025-11-28T20:15:30.000Z"
}
```

### Test Scenarios

#### Low Severity
```json
{
  "disease": "Malaria",
  "symptoms": {
    "feverPresence": "No",
    "bodyWeakness": "Mild",
    "headache": "Occasional"
  }
}
```
Expected: `severityRank: "Low"`, `severityScore: 20`

#### Mild Severity
```json
{
  "disease": "Malaria",
  "symptoms": {
    "feverPresence": "Yes",
    "feverDuration": "2 days",
    "bodyWeakness": "Moderate"
  }
}
```
Expected: `severityRank: "Mild"`, `severityScore: 60`

#### Severe Severity
```json
{
  "disease": "Malaria",
  "symptoms": {
    "feverPresence": "Yes",
    "feverDuration": "5 days",
    "bodyWeakness": "Severe",
    "vomiting": "Yes",
    "headache": "Severe"
  }
}
```
Expected: `severityRank: "Severe"`, `severityScore: 90`

---

## Option 2: Use Services in Your Code

### How to Call AIService

#### Step 1: Import AIModule in Your Module

```typescript
// src/your-module/your.module.ts
import { Module } from '@nestjs/common';
import { AIModule } from '../ai/ai.module';
import { YourService } from './your.service';

@Module({
  imports: [AIModule],
  providers: [YourService],
})
export class YourModule {}
```

#### Step 2: Inject AIService in Your Service

```typescript
// src/your-module/your.service.ts
import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';

@Injectable()
export class YourService {
  constructor(private readonly aiService: AIService) {}

  async analyzePatientSymptoms() {
    const result = await this.aiService.generateDiagnosis({
      disease: 'Malaria',
      symptoms: {
        feverPresence: 'Yes',
        feverDuration: '3 days',
        bodyWeakness: 'Moderate',
      },
      additionalNotes: 'Patient traveled to endemic area',
    });

    console.log('Diagnosis:', result.suggestedDiagnosis);
    console.log('Severity:', result.severityRank);
    console.log('Score:', result.severityScore);
    
    return result;
  }
}
```

#### What to Pass to `generateDiagnosis()`

**Method Signature:**
```typescript
generateDiagnosis(input: AIGenerateDiagnosisInput): Promise<AIGenerateDiagnosisOutput>
```

**Input Interface:**
```typescript
interface AIGenerateDiagnosisInput {
  disease: string;                    // Required: "Malaria", "Typhoid", etc.
  symptoms: Record<string, string>;   // Required: Key-value pairs of symptoms
  additionalNotes?: string;           // Optional: Extra context
}
```

**Output Interface:**
```typescript
interface AIGenerateDiagnosisOutput {
  suggestedDiagnosis: string;         // AI diagnosis text
  severityRank: 'Low' | 'Mild' | 'Severe';  // Severity classification
  managementTips: string[];           // Array of recommendations
  reasoning: string;                  // AI explanation
  severityScore: number;              // 0-100 for queue priority
}
```

**Example Usage:**
```typescript
const diagnosis = await this.aiService.generateDiagnosis({
  disease: 'Malaria',
  symptoms: {
    feverPresence: 'Yes',
    feverDuration: '4 days',
    bodyWeakness: 'Severe',
    headache: 'Persistent',
    shivering: 'Yes',
    vomiting: 'No',
    travelHistory: 'Visited high-risk area',
  },
  additionalNotes: 'Patient has history of malaria',
});

// Use the results
if (diagnosis.severityScore >= 80) {
  // High priority - add to urgent queue
} else if (diagnosis.severityScore >= 40) {
  // Medium priority
} else {
  // Low priority
}
```

---

### How to Call DiagnosisService

#### Step 1: Import DiagnosisModule

```typescript
// src/your-module/your.module.ts
import { Module } from '@nestjs/common';
import { DiagnosisModule } from '../diagnosis/diagnosis.module';
import { YourService } from './your.service';

@Module({
  imports: [DiagnosisModule],
  providers: [YourService],
})
export class YourModule {}
```

#### Step 2: Inject DiagnosisService

```typescript
// src/your-module/your.service.ts
import { Injectable } from '@nestjs/common';
import { DiagnosisService } from '../diagnosis/diagnosis.service';

@Injectable()
export class YourService {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  async processPatientDiagnosis(patientId: string) {
    const result = await this.diagnosisService.submitDiagnosis({
      patientUserId: patientId,
      disease: 'Malaria',
      symptoms: {
        feverPresence: 'Yes',
        feverDuration: '3 days',
      },
    });

    // Result includes AI feedback + metadata
    console.log('Patient:', result.patientUserId);
    console.log('Severity Score:', result.severityScore);
    console.log('Model Used:', result.modelVersion);
    
    return result;
  }
}
```

#### What to Pass to `submitDiagnosis()`

**Method Signature:**
```typescript
submitDiagnosis(input: SubmitDiagnosisInput): Promise<DiagnosisResult>
```

**Input Interface:**
```typescript
interface SubmitDiagnosisInput {
  patientUserId: string;              // Required: Patient identifier
  disease: string;                    // Required: Disease type
  symptoms: Record<string, string>;   // Required: Symptom data
  additionalNotes?: string;           // Optional: Extra context
}
```

**Output Interface:**
```typescript
interface DiagnosisResult {
  patientUserId: string;
  disease: string;
  symptoms: Record<string, string>;
  aiFeedback: {
    suggestedDiagnosis: string;
    severityRank: 'Low' | 'Mild' | 'Severe';
    managementTips: string[];
    reasoning: string;
  };
  severityScore: number;
  modelVersion: string;
  submittedAt: Date;
}
```

**Example Usage:**
```typescript
const diagnosis = await this.diagnosisService.submitDiagnosis({
  patientUserId: 'patient_12345',
  disease: 'Malaria',
  symptoms: {
    feverPresence: 'Yes',
    feverDuration: '3 days',
    bodyWeakness: 'Moderate',
  },
  additionalNotes: 'Patient traveled to endemic area last week',
});

// Access the results
console.log(diagnosis.aiFeedback.suggestedDiagnosis);
console.log(diagnosis.severityScore); // Use for queue priority
```

---

## Severity Score Reference

| Severity Rank | Score | Queue Priority | Use Case |
|---------------|-------|----------------|----------|
| **Severe** | 90 | Urgent | Immediate medical attention required |
| **Mild** | 60 | Medium | Medical evaluation needed |
| **Low** | 20 | Low | Monitor symptoms, routine care |

**Queue Priority Formula:**
```
priority = severityScore × 100 + waitTimeMinutes
```

---

## Project Structure

```
src/
├── ai/
│   ├── ai.service.ts       # Core AI service (import this)
│   ├── ai.controller.ts    # Test endpoint
│   └── ai.module.ts        # Export AIService
├── diagnosis/
│   ├── diagnosis.service.ts    # Diagnosis orchestration (import this)
│   ├── diagnosis.controller.ts # Production endpoint
│   └── diagnosis.module.ts     # Export DiagnosisService
└── app.module.ts
```

---

## Common Integration Patterns

### Pattern 1: Queue Module Using Severity Score
```typescript
@Injectable()
export class QueueService {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  async addToQueue(patientId: string, symptoms: any) {
    const diagnosis = await this.diagnosisService.submitDiagnosis({
      patientUserId: patientId,
      disease: 'Malaria',
      symptoms,
    });

    const priority = diagnosis.severityScore * 100;
    await this.queueRepository.add({ patientId, priority });
  }
}
```

### Pattern 2: Reports Module Using AI Feedback
```typescript
@Injectable()
export class ReportsService {
  constructor(private readonly aiService: AIService) {}

  async generateReport(symptoms: any) {
    const analysis = await this.aiService.generateDiagnosis({
      disease: 'Malaria',
      symptoms,
    });

    return {
      diagnosis: analysis.suggestedDiagnosis,
      recommendations: analysis.managementTips,
      severity: analysis.severityRank,
    };
  }
}
```

---

## Technologies Used

- **NestJS** — Node.js framework for building scalable server-side applications
- **TypeScript** — Typed JavaScript superset
- **MongoDB** — NoSQL database with Mongoose ODM
- **Google Gemini AI** — AI-powered diagnosis generation
- **JWT** — Authentication and authorization
- **ESLint & Prettier** — Code linting and formatting
- **Jest** — Testing framework

---

## API Endpoints Reference

### Diagnosis Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/diagnosis/submit` | Submit diagnosis with AI analysis |
| POST | `/ai/diagnose` | Direct AI diagnosis (development) |

### Diagnosis Report Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/diagnosis-report` | Create a new diagnosis report |
| GET | `/diagnosis-report/:id` | Get diagnosis report by ID |
| GET | `/diagnosis-report/patient/:patientUserId` | Get patient's reports |
| PATCH | `/diagnosis-report/feedback/:id` | Update doctor feedback |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health/db` | Check MongoDB connection status |

---

## Testing

Run the unit tests:
```bash
npm run test
```

---

## License

UNLICENSED - Private use only

For further enquiries contact: austinibe15@gmail.com
