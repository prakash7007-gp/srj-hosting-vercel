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
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
