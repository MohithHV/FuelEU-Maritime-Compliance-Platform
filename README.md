# FuelEU Maritime Compliance Platform

A full-stack web application for managing maritime fuel compliance, implementing **Fuel EU Maritime Regulation (EU) 2023/1805** for compliance balance (CB) calculation, banking, and pooling.

![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue)
![Architecture](https://img.shields.io/badge/Architecture-Hexagonal-green)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Development](#development)

---

## 🎯 Overview

The **FuelEU Maritime Compliance Platform** helps shipping companies track and manage their greenhouse gas (GHG) emissions compliance according to the FuelEU Maritime regulation. It provides:

- **Route Management**: Track vessel routes with fuel consumption and GHG intensity data
- **Compliance Comparison**: Compare actual performance against baseline targets
- **Banking**: Bank surplus compliance balance for future use
- **Pooling**: Create pools to share compliance balance across multiple vessels

### Key Compliance Features

- **Target Intensity (2025)**: 89.3368 gCO₂e/MJ (2% reduction from baseline 91.16)
- **Compliance Balance Calculation**: `CB = (Target - Actual) × Energy in scope`
- **Banking (Article 20)**: Carry forward surplus to cover future deficits
- **Pooling (Article 21)**: Aggregate compliance across vessel groups

---

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (Ports & Adapters / Clean Architecture) for both frontend and backend, ensuring:

- **Separation of Concerns**: Business logic independent of frameworks
- **Testability**: Easy to test domain logic in isolation
- **Flexibility**: Swap implementations without affecting core business rules

### Backend Structure

```
backend/src/
├── core/
│   ├── domain/              # Entities & Domain Services
│   ├── application/         # Use Cases
│   └── ports/               # Repository Interfaces
├── adapters/
│   ├── inbound/http/        # Express Controllers
│   └── outbound/postgres/   # Prisma Repositories
└── infrastructure/          # Server & Database Setup
```

### Frontend Structure

```
frontend/src/
├── core/
│   ├── domain/              # TypeScript Interfaces
│   ├── application/         # React Query Hooks
│   └── ports/               # Repository Interfaces
├── adapters/
│   ├── ui/                  # React Components
│   └── infrastructure/      # API Clients (Axios)
└── shared/                  # Utilities
```

---

## ✨ Features

### 1. Routes Management
- 📊 View all routes with filtering (vessel type, fuel type, year)
- 🎯 Set baseline route for compliance comparison
- 📈 Display GHG intensity, fuel consumption, distance, emissions

### 2. Compliance Comparison
- 📉 Compare routes against baseline
- ✅ Compliant/non-compliant indicators
- 📊 Visual charts (bar/line) using Recharts
- 🎯 Target: 89.3368 gCO₂e/MJ

### 3. Banking (Article 20)
- 💰 Bank positive compliance balance
- 📥 Apply banked surplus to cover deficits
- 📜 Transaction history
- ⚠️ Validation: Cannot bank negative CB

### 4. Pooling (Article 21)
- 👥 Create compliance pools with multiple vessels
- ⚖️ Greedy allocation algorithm for CB distribution
- ✅ Pool validation (sum ≥ 0, deficit ships don't exit worse)
- 📊 Visual pool sum indicator

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 7
- **Validation**: express-validator
- **Testing**: Jest, Supertest

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS 4
- **State Management**: @tanstack/react-query
- **HTTP Client**: Axios
- **Charts**: Recharts

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **PostgreSQL**: v14 or higher (or use Prisma's local dev database)

### 1. Clone the Repository

```bash
git clone https://github.com/MohithHV/FuelEU-Maritime-Compliance-Platform.git
cd FuelEU-Maritime-Compliance-Platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

---

## ▶️ Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

The backend API will start on **http://localhost:3001**

### Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on **http://localhost:3000**

Open **http://localhost:3000** in your browser.

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 📚 API Documentation

### Routes Endpoints

- `GET /api/routes` - Get all routes with optional filters
- `POST /api/routes/:routeId/baseline` - Set baseline route
- `GET /api/routes/comparison` - Get baseline vs actual comparison

### Compliance Endpoints

- `GET /api/compliance/cb?shipId=X&year=Y` - Get compliance balance
- `GET /api/compliance/adjusted-cb?shipId=X&year=Y` - Get adjusted CB

### Banking Endpoints

- `GET /api/banking/records?shipId=X&year=Y` - Get bank records
- `POST /api/banking/bank` - Bank positive CB
- `POST /api/banking/apply` - Apply banked surplus

### Pooling Endpoints

- `POST /api/pools` - Create compliance pool

For complete API documentation, see: `backend/src/adapters/inbound/http/API_ENDPOINTS.md`

---

## 👨‍💻 Development

### Code Quality

```bash
# Backend
cd backend
npm run lint
npm run format
npm run build

# Frontend
cd frontend
npm run lint
npm run build
```

### Database Management

```bash
cd backend
npm run prisma:studio  # Open Prisma Studio GUI
```

---

## 📄 Documentation

- **AGENT_WORKFLOW.md** - AI agent usage documentation
- **REFLECTION.md** - Development reflection essay
- **backend/src/adapters/inbound/http/API_ENDPOINTS.md** - Complete API reference

---

## 🙏 Acknowledgments

- Built using **Hexagonal Architecture** principles
- Developed with assistance from **Claude Code** (AI pair programming)
- Implements **FuelEU Maritime Regulation (EU) 2023/1805**

---

**Built with ❤️ using React, Node.js, and Clean Architecture**
