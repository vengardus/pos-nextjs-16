/*
  Warnings:

  - You are about to drop the `cash_register_payment_details` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cash_register_payment_details" DROP CONSTRAINT "cash_register_payment_details_cash_register_closure_id_fkey";

-- DropForeignKey
ALTER TABLE "cash_register_payment_details" DROP CONSTRAINT "cash_register_payment_details_payment_method_id_fkey";

-- DropForeignKey
ALTER TABLE "cash_register_payment_details" DROP CONSTRAINT "cash_register_payment_details_sale_id_fkey";

-- DropForeignKey
ALTER TABLE "cash_register_payment_details" DROP CONSTRAINT "cash_register_payment_details_user_id_fkey";

-- DropTable
DROP TABLE "cash_register_payment_details";
