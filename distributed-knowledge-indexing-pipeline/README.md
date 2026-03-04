#  Distributed Knowledge Index Pipeline 

An AI-powered document indexing and retrieval system implementing a distributed **fan-out / fan-in architecture** with a complete **Retrieval-Augmented Generation (RAG)** pipeline.

This project demonstrates backend-heavy system design, async job orchestration, vector search optimization, and applied AI integration.

---

##  Overview

The Knowledge Index Pipeline allows users to:

1. Upload documents  
2. Automatically split them into token-aware chunks  
3. Generate embeddings asynchronously  
4. Store vectors in PostgreSQL using **pgvector**  
5. Perform semantic similarity search  
6. Generate context-grounded answers using an LLM  

The system is designed with production-style architecture principles including background processing, transactional consistency, and vector indexing.

---

## Architecture

### Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL + pgvector  
- **ORM:** Prisma  
- **Queue:** BullMQ  
- **Cache/Queue Backend:** Redis  
- **AI:** OpenAI (Embeddings + Chat Models)  
- **Containerization:** Docker  

---

##  System Design

###  Distributed Ingestion Pipeline (Fan-Out / Fan-In)

```
Document Upload
      ↓
Chunking (100 size, 20 overlap)
      ↓
Fan-out → Chunk Batch Jobs (BullMQ)
      ↓
Embedding Generation (1536-dim vectors)
      ↓
Store in pgvector
      ↓
Fan-in → Document Finalization
```


### Key Concepts Implemented

- Asynchronous background processing  
- Batch embedding generation  
- Transaction-safe chunk + document updates  
- Idempotent job handling  
- Distributed job orchestration  
- HNSW vector indexing  

---

##  AI Pipeline (RAG)

### Embedding

- Model: `text-embedding-3-small`
- 1536-dimensional vectors
- Stored as `vector(1536)` in PostgreSQL
- Cosine similarity search

### Retrieval

```sql
ORDER BY embedding <=> query_vector
LIMIT top_k;

```
- HNSW index for low-latency semantic retrieval
---
## Generation

- Context assembly from top-k chunks

- Prompt engineering with context grounding

- LLM generates answer constrained to retrieved data
---
##  Database Schema
### Core Tables

- User

- Document

- Chunk

- Query

### Important Details

- embedding vector(1536)

- HNSW index on embedding column

- Raw SQL for vector similarity operations

- Prisma Unsupported("vector") for schema compatibility

##  Features (V1)

- JWT-based authentication

- File upload and parsing

- Token-aware chunking (100 size, 20 overlap)

- Async embedding generation with BullMQ

- Batch processing for embedding efficiency

- pgvector HNSW indexing

- Cosine similarity semantic search

- Full RAG query endpoint

- Transactional state management

- Dockerized PostgreSQL with pgvector

## Performance Optimizations

- HNSW index for low-latency similarity search

- Batch embedding API calls

- Background job retry strategies

- Document progress tracking (processedChunks)

- Separation of ingestion and query pipelines

##  Learning Outcomes

### This project demonstrates:

- Distributed backend architecture

- Fan-out / fan-in job orchestration

- Vector databases (pgvector)

- HNSW indexing

- Applied embeddings

- Retrieval-Augmented Generation

- Async processing patterns

- ORM + raw SQL hybrid usage

##  Summary

The Distributed Knowledge Index Pipeline is a backend-focused AI system that combines asynchronous processing, vector search, and RAG architecture to deliver scalable semantic document retrieval.

It is designed to reflect real-world AI infrastructure rather than a simple chatbot implementation.