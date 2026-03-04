-- This is an empty migration.
CREATE INDEX chunk_embedding_idx
ON "Chunk"
USING hnsw (embedding vector_cosine_ops);