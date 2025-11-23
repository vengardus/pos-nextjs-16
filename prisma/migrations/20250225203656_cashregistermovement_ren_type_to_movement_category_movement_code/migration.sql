/*
  Warnings:

  - You are about to drop the column `type` on the `cash_register_movements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cash_register_movements" DROP COLUMN "type",
ADD COLUMN     "movementCategory" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "movementCode" TEXT NOT NULL DEFAULT '';
