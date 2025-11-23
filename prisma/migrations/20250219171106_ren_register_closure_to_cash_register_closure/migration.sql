/*
  Warnings:

  - You are about to drop the `register_closure` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "register_closure" DROP CONSTRAINT "register_closure_cash_register_id_fkey";

-- DropForeignKey
ALTER TABLE "register_closure" DROP CONSTRAINT "register_closure_user_id_fkey";

-- DropTable
DROP TABLE "register_closure";

-- CreateTable
CREATE TABLE "cash_register_closure" (
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

    CONSTRAINT "cash_register_closure_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cash_register_closure" ADD CONSTRAINT "cash_register_closure_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_register_closure" ADD CONSTRAINT "cash_register_closure_cash_register_id_fkey" FOREIGN KEY ("cash_register_id") REFERENCES "cash_register"("id") ON DELETE CASCADE ON UPDATE CASCADE;
