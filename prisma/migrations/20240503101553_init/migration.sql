/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "token_value_key" ON "token"("value");
