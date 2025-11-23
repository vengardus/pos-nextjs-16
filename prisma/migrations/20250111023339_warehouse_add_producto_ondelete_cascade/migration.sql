-- DropForeignKey
ALTER TABLE "warehouses" DROP CONSTRAINT "warehouses_product_id_fkey";

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
