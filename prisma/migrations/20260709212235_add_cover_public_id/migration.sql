/*
  Warnings:

  - You are about to drop the column `cover` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "cover",
ADD COLUMN     "coverPublicId" TEXT,
ADD COLUMN     "coverURL" TEXT;
