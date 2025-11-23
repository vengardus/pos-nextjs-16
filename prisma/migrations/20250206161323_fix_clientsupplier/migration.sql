/*
  Warnings:

  - You are about to drop the `ClientSupplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClientSupplier" DROP CONSTRAINT "ClientSupplier_company_id_fkey";

-- DropTable
DROP TABLE "ClientSupplier";

-- CreateTable
CREATE TABLE "clients_suppliers" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "natural_identifier" TEXT,
    "legal_identifier" TEXT,
    "person_type" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "company_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "clients_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_suppliers_name_key" ON "clients_suppliers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "clients_suppliers_natural_identifier_person_type_key" ON "clients_suppliers"("natural_identifier", "person_type");

-- CreateIndex
CREATE UNIQUE INDEX "clients_suppliers_legal_identifier_person_type_key" ON "clients_suppliers"("legal_identifier", "person_type");

-- AddForeignKey
ALTER TABLE "clients_suppliers" ADD CONSTRAINT "clients_suppliers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
