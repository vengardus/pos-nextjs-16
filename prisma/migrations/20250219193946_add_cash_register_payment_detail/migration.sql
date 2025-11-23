-- CreateTable
CREATE TABLE "cash_register_payment_details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "chamge_due" DOUBLE PRECISION NOT NULL,
    "payment_method_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "cash_register_closure_id" UUID NOT NULL,
    "sale_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cash_register_payment_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cash_register_payment_details" ADD CONSTRAINT "cash_register_payment_details_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_register_payment_details" ADD CONSTRAINT "cash_register_payment_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_register_payment_details" ADD CONSTRAINT "cash_register_payment_details_cash_register_closure_id_fkey" FOREIGN KEY ("cash_register_closure_id") REFERENCES "cash_register_closure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_register_payment_details" ADD CONSTRAINT "cash_register_payment_details_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
