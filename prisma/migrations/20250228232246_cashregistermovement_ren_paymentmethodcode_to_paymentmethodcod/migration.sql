/*
  Warnings:

  - You are about to drop the column `paymentMethodCode` on the `cash_register_movements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cash_register_movements" DROP COLUMN "paymentMethodCode",
ADD COLUMN     "paymentMethodCod" TEXT NOT NULL DEFAULT '';
