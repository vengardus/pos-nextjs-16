/*
  Warnings:

  - You are about to drop the column `paymentCode` on the `cash_register_movements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cash_register_movements" DROP COLUMN "paymentCode",
ADD COLUMN     "paymentMethodCode" TEXT NOT NULL DEFAULT '';
