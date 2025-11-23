-- CreateTable
CREATE TABLE "ClientSupplier" (
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

    CONSTRAINT "ClientSupplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientSupplier_name_key" ON "ClientSupplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ClientSupplier_natural_identifier_person_type_key" ON "ClientSupplier"("natural_identifier", "person_type");

-- CreateIndex
CREATE UNIQUE INDEX "ClientSupplier_legal_identifier_person_type_key" ON "ClientSupplier"("legal_identifier", "person_type");

-- AddForeignKey
ALTER TABLE "ClientSupplier" ADD CONSTRAINT "ClientSupplier_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
