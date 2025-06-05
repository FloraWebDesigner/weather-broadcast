/*
  Warnings:

  - The primary key for the `broadcast` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `voice` on the `broadcast` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `date` on table `broadcast` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "broadcast" DROP CONSTRAINT "broadcast_pkey",
ADD COLUMN     "lastAudioUpdate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "voice",
ADD COLUMN     "voice" TEXT NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "broadcast_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "broadcast_id_seq";

-- DropEnum
DROP TYPE "Voice";
