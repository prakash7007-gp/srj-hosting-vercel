/*
  Warnings:

  - You are about to drop the column `nextFollowup` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "nextFollowup",
ADD COLUMN     "next_followup_date" TIMESTAMP(3);
