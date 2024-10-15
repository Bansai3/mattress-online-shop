/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `mattress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "mattress_name_key" ON "mattress"("name");
