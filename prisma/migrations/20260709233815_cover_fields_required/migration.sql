/*
  Warnings:

  - Made the column `coverPublicId` on table `Song` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coverURL` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "coverPublicId" SET NOT NULL,
ALTER COLUMN "coverURL" SET NOT NULL;
