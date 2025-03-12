-- CreateEnum
CREATE TYPE "Voice" AS ENUM ('alloy', 'ash', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer');

-- CreateEnum
CREATE TYPE "Province" AS ENUM ('Alberta', 'British_Columbia', 'Manitoba', 'New_Brunswick', 'Newfoundland_and_Labrador', 'Nova_Scotia', 'Ontario', 'Quebec', 'Saskatchewan', 'Prince_Edward_Island');

-- CreateTable
CREATE TABLE "Broadcast" (
    "id" SERIAL NOT NULL,
    "host" TEXT NOT NULL,
    "voice" "Voice" NOT NULL DEFAULT 'alloy',
    "province" "Province" NOT NULL DEFAULT 'Ontario',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Broadcast_pkey" PRIMARY KEY ("id")
);
