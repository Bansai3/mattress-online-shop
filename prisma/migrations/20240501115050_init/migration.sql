/*
  Warnings:

  - Added the required column `image_link` to the `mattress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mattress" ADD COLUMN     "image_link" TEXT NOT NULL;
