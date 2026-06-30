/*
  Warnings:

  - You are about to drop the column `isEP` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "isEP",
ADD COLUMN     "albumNote" TEXT;
