ALTER TABLE "Category" ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN "details" JSONB, ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 0;
CREATE TYPE "ContentKind" AS ENUM ('PAGE', 'ARTICLE', 'COPY', 'SETTINGS');
CREATE TABLE "ContentEntry" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "kind" "ContentKind" NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL DEFAULT '',
  "body" JSONB NOT NULL,
  "published" JSONB,
  "publishedAt" TIMESTAMP(3),
  "revision" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContentEntry_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ContentEntry_key_key" ON "ContentEntry"("key");
CREATE INDEX "ContentEntry_kind_publishedAt_idx" ON "ContentEntry"("kind", "publishedAt");
CREATE TABLE "ContentRevision" (
  "id" TEXT NOT NULL,
  "entryId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "snapshot" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContentRevision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ContentRevision_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "ContentEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ContentRevision_entryId_version_key" ON "ContentRevision"("entryId", "version");
CREATE TABLE "MediaAsset" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "alt" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "data" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);
