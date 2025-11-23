/*
  Warnings:

  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,company_id]` on the table `clients_suppliers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[natural_identifier,person_type,company_id]` on the table `clients_suppliers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[legal_identifier,person_type,company_id]` on the table `clients_suppliers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_company_id_fkey";

-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_client_id_fkey";

-- DropIndex
DROP INDEX "clients_suppliers_legal_identifier_person_type_key";

-- DropIndex
DROP INDEX "clients_suppliers_name_key";

-- DropIndex
DROP INDEX "clients_suppliers_natural_identifier_person_type_key";

-- DropTable
DROP TABLE "clients";

-- CreateIndex
CREATE UNIQUE INDEX "clients_suppliers_name_company_id_key" ON "clients_suppliers"("name", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "clients_suppliers_natural_identifier_person_type_company_id_key" ON "clients_suppliers"("natural_identifier", "person_type", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "clients_suppliers_legal_identifier_person_type_company_id_key" ON "clients_suppliers"("legal_identifier", "person_type", "company_id");
