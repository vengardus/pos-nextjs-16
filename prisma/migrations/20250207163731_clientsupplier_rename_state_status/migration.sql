/*
  Warnings:

  - You are about to drop the column `state` on the `clients_suppliers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients_suppliers" DROP COLUMN "state",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'A';
