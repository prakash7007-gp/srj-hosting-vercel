/*
  Warnings:

  - You are about to drop the `Followup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Visit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Followup" DROP CONSTRAINT "Followup_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_patientId_fkey";

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "adhar" SET DATA TYPE BIGINT;

-- DropTable
DROP TABLE "Followup";

-- DropTable
DROP TABLE "Visit";
