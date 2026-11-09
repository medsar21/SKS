ALTER TYPE "QuoteStatus" ADD VALUE 'SUBMITTED';
ALTER TABLE "Quote" ALTER COLUMN "customerId" DROP NOT NULL;
ALTER TABLE "Quote" ADD COLUMN "contactName" TEXT,
 ADD COLUMN "companyName" TEXT, ADD COLUMN "email" TEXT,
 ADD COLUMN "phone" TEXT, ADD COLUMN "city" TEXT,
 ADD COLUMN "siteAddress" TEXT, ADD COLUMN "requestType" TEXT,
 ADD COLUMN "rentalStart" DATE, ADD COLUMN "rentalEnd" DATE,
 ADD COLUMN "submissionHash" TEXT;
ALTER TABLE "QuoteLine" ALTER COLUMN "unitPrice" DROP NOT NULL,
 ALTER COLUMN "taxRate" DROP NOT NULL;
CREATE INDEX "Quote_status_createdAt_idx" ON "Quote"("status", "createdAt");
CREATE INDEX "Quote_submissionHash_createdAt_idx" ON "Quote"("submissionHash", "createdAt");
