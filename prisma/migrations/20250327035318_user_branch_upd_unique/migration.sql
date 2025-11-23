/*
  Warnings:

  - A unique constraint covering the columns `[branch_id,user_id,cash_register_id]` on the table `branch_user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "branch_user_branch_id_user_id_idx";

-- DropIndex
DROP INDEX "branch_user_branch_id_user_id_key";

-- CreateIndex
CREATE INDEX "branch_user_branch_id_user_id_cash_register_id_idx" ON "branch_user"("branch_id", "user_id", "cash_register_id");

-- CreateIndex
CREATE UNIQUE INDEX "branch_user_branch_id_user_id_cash_register_id_key" ON "branch_user"("branch_id", "user_id", "cash_register_id");
