-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "address" TEXT,
ADD COLUMN     "fees" INTEGER,
ADD COLUMN     "nextFollowup" TIMESTAMP(3),
ADD COLUMN     "treatmentPurpose" TEXT;
