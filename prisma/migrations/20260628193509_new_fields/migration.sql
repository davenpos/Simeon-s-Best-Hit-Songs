/*
  Warnings:

  - Added the required column `album` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cover` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "album" TEXT NOT NULL,
ADD COLUMN     "cover" TEXT NOT NULL,
ADD COLUMN     "isEP" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "label" TEXT NOT NULL;
