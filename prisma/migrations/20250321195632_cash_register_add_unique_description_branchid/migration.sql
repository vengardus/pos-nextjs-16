/*
  Warnings:

  - A unique constraint covering the columns `[description,branch_id]` on the table `cash_register` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cash_register_description_branch_id_key" ON "cash_register"("description", "branch_id");
