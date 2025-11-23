/*
  Warnings:

  - You are about to drop the column `isDefault` on the `roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "roles" DROP COLUMN "isDefault",
ADD COLUMN     "is_default" BOOLEAN NOT NULL DEFAULT false;
