/*
  Warnings:

  - You are about to drop the column `module_id` on the `permissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[role_id,module_cod,company_id]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `module_cod` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role_id` on the `permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "permissions_role_id_module_id_company_id_key";

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "module_id",
ADD COLUMN     "module_cod" TEXT NOT NULL,
DROP COLUMN "role_id",
ADD COLUMN     "role_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cod" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "company_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "roles_company_id_idx" ON "roles"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_cod_company_id_key" ON "roles"("cod", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_description_company_id_key" ON "roles"("description", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_role_id_module_cod_company_id_key" ON "permissions"("role_id", "module_cod", "company_id");

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
