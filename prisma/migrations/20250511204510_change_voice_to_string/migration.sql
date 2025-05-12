/*
  Warnings:

  - Changed the type of `voice` on the `broadcast` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `date` on table `broadcast` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "broadcast" ADD COLUMN     "lastAudioUpdate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "voice",
ADD COLUMN     "voice" TEXT NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);
