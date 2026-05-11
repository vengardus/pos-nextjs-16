-- CreateTable
CREATE TABLE "logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "request_path" TEXT,
    "country_code" TEXT,
    "device_type" TEXT,
    "timezone" TEXT,
    "user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_policies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "authorized_provider_email_id" UUID,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "max_users" INTEGER NOT NULL DEFAULT 10,
    "max_records_per_entity" INTEGER NOT NULL DEFAULT 50,
    "max_guest_signups_per_ip_per_day" INTEGER NOT NULL DEFAULT 5,
    "guest_ttl_days" INTEGER NOT NULL DEFAULT 7,
    "allow_csv_import_for_guest" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demo_policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "demo_policies_company_id_key" ON "demo_policies"("company_id");

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_policies" ADD CONSTRAINT "demo_policies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
