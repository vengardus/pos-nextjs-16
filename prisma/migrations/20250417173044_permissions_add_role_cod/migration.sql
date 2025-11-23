/*
  Warnings:

  - Added the required column `role_cod` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "role_cod" TEXT NOT NULL;
