/*
  Warnings:

  - Added the required column `cash_register_id` to the `branch_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "branch_user" ADD COLUMN     "cash_register_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "branch_user" ADD CONSTRAINT "branch_user_cash_register_id_fkey" FOREIGN KEY ("cash_register_id") REFERENCES "cash_register"("id") ON DELETE CASCADE ON UPDATE CASCADE;
