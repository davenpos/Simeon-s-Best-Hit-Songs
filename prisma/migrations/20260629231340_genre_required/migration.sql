/*
  Warnings:

  - Made the column `genre` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "genre" SET NOT NULL;
