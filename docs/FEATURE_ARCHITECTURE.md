# Feature Architecture

## 1. Core Product Modules

### Authentication Module

Responsibilities:

* signup
* login
* JWT authentication
* logout
* protected routes

### Interview Module

Responsibilities:

* create session
* generate questions
* answer submission
* interview progression
* session completion

### AI Evaluation Module

Responsibilities:

* prompt generation
* answer evaluation
* scoring
* feedback generation

### Dashboard Module

Responsibilities:

* user overview
* recent interviews
* progress stats

### History Module

Responsibilities:

* previous interview sessions
* score tracking
* analytics

---

## 2. Frontend Pages

### Public Pages

* Landing Page
* Login
* Signup

### Protected Pages

* Dashboard
* Start Interview
* Active Interview Session
* Session Summary
* History
* Profile

---

## 3. Backend Modules

### Routes

* auth routes
* interview routes
* session routes
* analytics routes

### Services

* auth service
* AI service
* interview service
* analytics service

### Models

* User
* InterviewSession
* Question
* Feedback

---

## 4. Core Workflow

User Login
→ Dashboard
→ Start Interview
→ Generate AI Question
→ Submit Answer
→ AI Evaluation
→ Save Session Data
→ Generate Feedback
→ Display Results

---

## 5. Future Architecture Extensions

* realtime interviews
* voice-based interviews
* AI follow-up questioning
* recruiter dashboard
* company-specific interview modes
* RAG pipeline
* vector search
