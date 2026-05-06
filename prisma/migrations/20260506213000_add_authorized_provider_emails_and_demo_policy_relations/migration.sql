CREATE TABLE "authorized_provider_emails" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "expiration_date" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "authorized_provider_emails_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "authorized_provider_emails_email_key"
ON "authorized_provider_emails"("email");

CREATE INDEX "authorized_provider_emails_email_idx"
ON "authorized_provider_emails"("email");

ALTER TABLE "demo_policies"
ADD CONSTRAINT "demo_policies_authorized_provider_email_id_fkey"
FOREIGN KEY ("authorized_provider_email_id") REFERENCES "authorized_provider_emails"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS "demo_policies_authorized_provider_email_id_key"
ON "demo_policies"("authorized_provider_email_id");

ALTER TABLE "demo_policies"
ALTER COLUMN "is_enabled" SET DEFAULT false,
ALTER COLUMN "max_records_per_entity" SET DEFAULT 20,
ALTER COLUMN "guest_ttl_days" SET DEFAULT 15;
