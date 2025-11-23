/*
  Warnings:

  - You are about to drop the `multiprices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "multiprices" DROP CONSTRAINT "multiprices_product_id_fkey";

-- DropTable
DROP TABLE "multiprices";

-- CreateTable
CREATE TABLE "multi_prices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sale_price" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "product_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "multi_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "multi_prices_product_id_quantity_key" ON "multi_prices"("product_id", "quantity");

-- AddForeignKey
ALTER TABLE "multi_prices" ADD CONSTRAINT "multi_prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
