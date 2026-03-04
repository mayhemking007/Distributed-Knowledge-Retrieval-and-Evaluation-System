-- This is an empty migration.
ALTER TABLE "Chunk"
DROP COLUMN embedding;

ALTER TABLE "Chunk"
ADD COLUMN embedding vector(1536);