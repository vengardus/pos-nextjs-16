import prisma from "@/server/db/prisma";
import { ListTable } from "@/components/tables/list-table";
import { columns } from "./components/audit-logs-columns-def";
import { PageHeader } from "@/components/common/typography/page-header";

export default async function AuditLogsPage() {
  const data = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <PageHeader title="Logs de Auditoría" breadcrumb="SuperAdmin / Logs de Auditoría" />
      <ListTable 
        columnsDef={columns} 
        data={data} 
        handleAddRecord={() => {}}
        showAddButton={false}
        modelLabels={{ singularName: "Log", pluralName: "Logs" }}
      />
    </div>
  );
}
