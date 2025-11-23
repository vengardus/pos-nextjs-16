/*
  Warnings:

  - The `role_id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "role_id",
ADD COLUMN     "role_id" TEXT NOT NULL DEFAULT 'CASHIER';

-- DropEnum
DROP TYPE "user_role_enum";
