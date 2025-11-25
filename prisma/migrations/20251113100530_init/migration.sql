/*
  Warnings:

  - You are about to alter the column `adhar` on the `Patient` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "adhar" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "Visit" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextFollowup" TIMESTAMP(3),
    "fees" INTEGER,
    "notes" TEXT,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Followup" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feesPaid" INTEGER,
    "notes" TEXT,
    "nextDate" TIMESTAMP(3),
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "Followup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
