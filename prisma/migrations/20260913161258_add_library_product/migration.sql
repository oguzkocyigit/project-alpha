-- CreateTable
CREATE TABLE "LibraryProduct" (
    "id" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "defaultDosage" TEXT,
    "defaultTimeOfDay" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryProduct_pkey" PRIMARY KEY ("id")
);
