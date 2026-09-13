-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SUPPLEMENT', 'VITAMIN', 'PEPTIDE', 'ANABOLIC');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtocolItem" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "productName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "daysOfWeek" TEXT[],
    "timeOfDay" TEXT NOT NULL,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProtocolItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_slug_key" ON "Client"("slug");

-- CreateIndex
CREATE INDEX "ProtocolItem_clientId_idx" ON "ProtocolItem"("clientId");

-- AddForeignKey
ALTER TABLE "ProtocolItem" ADD CONSTRAINT "ProtocolItem_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
