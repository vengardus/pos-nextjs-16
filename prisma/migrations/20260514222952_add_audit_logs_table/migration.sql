-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT,
    "details" JSONB,
    "user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs"("action", "created_at");
