# Distributed Knowledge Retrieval and Evaluation System

A **microservice-based system for document ingestion, retrieval-augmented generation (RAG), and automated LLM answer evaluation**.

This project demonstrates how to build a **production-style AI backend architecture** using:

- **Node.js + Express**
- **PostgreSQL with pgvector**
- **Redis + BullMQ**
- **Docker + Docker Compose**
- **Microservices architecture**
- **LLM evaluation pipelines**

The system allows users to upload documents, query them using semantic search, generate answers using LLMs, and automatically evaluate those answers for **groundedness and hallucination**.

---

# Architecture Overview

The system consists of two main microservices:

```
Client
    │
    ▼
DIP Service (Retrieval + Answer Generation)
    │
    ▼
Evaluation Service (LLM Answer Evaluation)
    │
    ▼
Redis Queue (BullMQ)
    │
    ▼
Workers
    │
    ▼
PostgreSQL + pgvector
```

### Services

1. **Distributed Knowledge Indexing Pipeline (DIP)**  
   Handles:
   - Document ingestion
   - Chunking
   - Embedding generation
   - Vector storage
   - Semantic retrieval
   - Answer generation

2. **Evaluation Service**  
   Evaluates generated answers using LLM-based judging:
   - Groundedness scoring
   - Hallucination detection
   - Reasoning explanation

---

# Key Features

## Document Ingestion Pipeline

Documents are processed through a distributed pipeline:

```
Document Upload
    │
    ▼
Chunking (size=100, overlap=20)
    │
    ▼
Embedding Generation
    │
    ▼
pgvector Storage
```

Vector search is implemented using **PostgreSQL pgvector with HNSW indexing** for efficient similarity queries.

---

## Retrieval-Augmented Generation (RAG)

The query pipeline works as follows:

```
User Query
    │
    ▼
Query Embedding
    │
    ▼
Top-K Semantic Retrieval
    │
    ▼
Context Assembly
    │
    ▼
LLM Answer Generation
```

---

## LLM Evaluation Pipeline

Generated answers are evaluated asynchronously using a worker queue.

```
Answer Generated
    │
    ▼
Evaluation Job Created
    │
    ▼
Worker Processes Job
    │
    ▼
LLM Judge Model
    │
    ▼
Evaluation Stored
```

The evaluation returns:

- **Groundedness Score**
- **Hallucination Flag**
- **Reasoning Explanation**

---

# Tech Stack

| Component | Technology |
|-----------|------------|
Backend | Node.js, Express |
Database | PostgreSQL |
Vector Search | pgvector |
Queue System | Redis + BullMQ |
LLM APIs | OpenAI |
Containerization | Docker |
Orchestration | Docker Compose |

---

# Project Structure

```
.
├── distributed-knowledge-indexing-pipeline/
│ ├── src/
│ ├── Dockerfile
│ ├── Dockerfile.worker
│ └── package.json
│
├── evaluation-service/
│ ├── src/
│ ├── Dockerfile
│ ├── Dockerfile.worker
│ └── package.json
│
└── docker-compose.yml
```

---

# Running the Project

## Prerequisites

- Docker
- Docker Compose

---

## Start the System

From the project root:

```bash
docker compose up --build
```
### This starts the following containers:

DIP API

DIP Worker

Evaluation API

Evaluation Worker

Redis

PostgreSQL (pgvector)

### Verify Running Containers
```
docker ps
```
### Expected services:
```
dip-api
dip-worker
evaluation-api
evaluation-worker
redis
postgres
```
---
# API Flow
## Query Endpoint
### POST /query

Request:
```
{
  "question": "What are the benefits of microservices?",
  "documentId": "doc123"
}
```

Response:
```
{
  "success": true,
  "answer": "...generated answer...",
  "evaluation": {
    "groundednessScore": 4,
    "hallucinationFlag": false,
    "reasoning": "Answer is supported by retrieved context."
  }
}
```
---
# Evaluation Metrics

## The evaluation service measures:

### Groundedness

How well the answer is supported by retrieved context.

### Hallucination Detection

Detects information not present in the source document.

### Reasoning

Natural language explanation of the evaluation result.

---
## Worker Architecture

Both services use **BullMQ workers** for asynchronous processing.

Workers handle:

- Embedding generation
- Evaluation tasks

This allows the system to **scale horizontally**, since workers can be replicated independently of the API services.

---

## Development Workflow

After making code changes:

```bash
docker compose up --build
```

Restart containers without rebuilding images:

```
docker compose up
```

Stop all running services:
```
docker compose down
```
---

# Learning Goals

### This project demonstrates:

- Building microservice AI systems

- Implementing Retrieval-Augmented Generation (RAG) pipelines

- Designing evaluation frameworks for LLM outputs

- Using pgvector for semantic search

- Running distributed workers with BullMQ

- Deploying systems using Docker Compose