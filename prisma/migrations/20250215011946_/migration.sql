/*
  Warnings:

  - The primary key for the `cash_register` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `cash_register` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `clients_suppliers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `clients_suppliers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `kardex` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `kardex` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "cash_register" DROP CONSTRAINT "cash_register_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "cash_register_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "clients_suppliers" DROP CONSTRAINT "clients_suppliers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "clients_suppliers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "kardex" DROP CONSTRAINT "kardex_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "kardex_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "register_closure" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closing_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "income" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expenses" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cash_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculate_total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "real_total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "difference" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "initial_cash" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_id" UUID NOT NULL,
    "cash_register_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "register_closure_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "register_closure" ADD CONSTRAINT "register_closure_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "register_closure" ADD CONSTRAINT "register_closure_cash_register_id_fkey" FOREIGN KEY ("cash_register_id") REFERENCES "cash_register"("id") ON DELETE CASCADE ON UPDATE CASCADE;
