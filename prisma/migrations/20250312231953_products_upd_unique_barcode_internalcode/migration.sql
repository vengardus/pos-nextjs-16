/*
  Warnings:

  - A unique constraint covering the columns `[barcode,company_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[internal_code,company_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "products_barcode_key";

-- DropIndex
DROP INDEX "products_internal_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_company_id_key" ON "products"("barcode", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_internal_code_company_id_key" ON "products"("internal_code", "company_id");
