/*
  Warnings:

  - You are about to drop the column `logo` on the `companies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "branches" ALTER COLUMN "tax_address" DROP NOT NULL,
ALTER COLUMN "tax_address" DROP DEFAULT;

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "logo",
ADD COLUMN     "image_url" TEXT,
ALTER COLUMN "tax_id" DROP NOT NULL,
ALTER COLUMN "tax_id" DROP DEFAULT,
ALTER COLUMN "tax_address" DROP NOT NULL,
ALTER COLUMN "tax_address" DROP DEFAULT,
ALTER COLUMN "currency_symbol" DROP DEFAULT,
ALTER COLUMN "auth_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "document_number" DROP NOT NULL,
ALTER COLUMN "document_number" DROP DEFAULT,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "phone" DROP DEFAULT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "address" DROP DEFAULT;

-- CreateTable
CREATE TABLE "branch_user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "branch_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "branch_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "image_url" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "company_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "branch_user_branch_id_user_id_idx" ON "branch_user"("branch_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "branch_user_branch_id_user_id_key" ON "branch_user"("branch_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_company_id_key" ON "categories"("name", "company_id");

-- AddForeignKey
ALTER TABLE "branch_user" ADD CONSTRAINT "branch_user_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_user" ADD CONSTRAINT "branch_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
