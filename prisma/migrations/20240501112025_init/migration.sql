/*
  Warnings:

  - A unique constraint covering the columns `[id,name]` on the table `mattress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "mattress_id_name_key" ON "mattress"("id", "name");
