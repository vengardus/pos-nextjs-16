/*
  Warnings:

  - You are about to drop the column `closing_date` on the `cash_register_closure` table. All the data in the column will be lost.
  - You are about to drop the column `expenses` on the `cash_register_closure` table. All the data in the column will be lost.
  - You are about to drop the column `income` on the `cash_register_closure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cash_register_closure" DROP COLUMN "closing_date",
DROP COLUMN "expenses",
DROP COLUMN "income";
