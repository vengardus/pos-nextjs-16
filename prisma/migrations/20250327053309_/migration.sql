/*
  Warnings:

  - You are about to drop the column `temp` on the `branch_user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "branch_user_branch_id_user_id_cash_register_id_idx";

-- AlterTable
ALTER TABLE "branch_user" DROP COLUMN "temp",
ALTER COLUMN "cash_register_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "branch_user_branch_id_user_id_idx" ON "branch_user"("branch_id", "user_id");
