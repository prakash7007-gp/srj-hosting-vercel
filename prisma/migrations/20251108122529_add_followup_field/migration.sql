/*
  Warnings:

  - You are about to drop the column `next_followup_date` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "next_followup_date",
ADD COLUMN     "nextFollowup" TIMESTAMP(3);
