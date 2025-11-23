/*
  Warnings:

  - You are about to drop the `cash_register_movements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cash_register_movements" DROP CONSTRAINT "cash_register_movements_cash_register_id_fkey";

-- DropTable
DROP TABLE "cash_register_movements";
