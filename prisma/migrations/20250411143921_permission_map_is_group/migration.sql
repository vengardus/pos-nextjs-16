/*
  Warnings:

  - You are about to drop the column `isGroup` on the `permissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "isGroup",
ADD COLUMN     "is_group" BOOLEAN NOT NULL DEFAULT false;
