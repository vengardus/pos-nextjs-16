/*
  Warnings:

  - A unique constraint covering the columns `[name,company_id]` on the table `payment_methods` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cod,company_id]` on the table `payment_methods` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_name_company_id_key" ON "payment_methods"("name", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_cod_company_id_key" ON "payment_methods"("cod", "company_id");
