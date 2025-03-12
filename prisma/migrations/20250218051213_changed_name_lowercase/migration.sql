/*
  Warnings:

  - You are about to drop the `Broadcast` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Broadcast";

-- CreateTable
CREATE TABLE "broadcast" (
    "id" SERIAL NOT NULL,
    "host" TEXT NOT NULL,
    "voice" "Voice" NOT NULL DEFAULT 'alloy',
    "province" "Province" NOT NULL DEFAULT 'Ontario',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "broadcast_pkey" PRIMARY KEY ("id")
);
