/*
  Warnings:

  - You are about to drop the column `movementCode` on the `cash_register_movements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cash_register_movements" DROP COLUMN "movementCode",
ADD COLUMN     "movementType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "paymentCode" TEXT NOT NULL DEFAULT '';
