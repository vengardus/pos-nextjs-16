-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "kardex" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "multi_prices" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sale_details" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sales" ALTER COLUMN "updated_at" DROP NOT NULL;
