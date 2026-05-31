# System Design

## 1. High-Level Architecture

Frontend (React)
→
Backend API (Express)
→
AI Service Layer
→
OpenAI API
→
MongoDB

---

## 2. Backend Architecture

Routes
→ Controllers
→ Services
→ Models
→ Database

---

## 3. Core Workflow

User
→ Login
→ Start Interview
→ Generate Question
→ Submit Answer
→ AI Evaluation
→ Save Feedback
→ Session Summary

---

## 4. Database Collections

* Users
* InterviewSessions
* Questions
* Feedback

---

## 5. Authentication Flow

Login
→ JWT Generated
→ Protected Routes
→ Middleware Verification

---

## 6. AI Evaluation Pipeline

Question

* User Answer
* Metadata
  →
  Prompt Builder
  →
  OpenAI API
  →
  Structured Feedback
  →
  Database Storage

---

## 7. Future Scaling

* Redis caching
* WebSockets
* RAG pipeline
* Vector database
* Queue system
