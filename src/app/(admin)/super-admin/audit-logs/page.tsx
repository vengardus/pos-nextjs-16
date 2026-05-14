import { ListTable } from "@/components/tables/list-table";
import { columns } from "./components/audit-logs-columns-def";
import { PageHeader } from "@/components/common/typography/page-header";
import { format } from "date-fns";
import { auditLogGetAllCached } from "@/server/modules/audit-log/next/cache/audit-log.get-all.cache";

export default async function AuditLogsPage() {
  const data = await auditLogGetAllCached();

  const formattedData = data.map((log) => ({
    ...log,
    formattedDate: format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss"),
  }));

  return (
    <div className="p-6">
      <PageHeader title="Logs de Auditoría" breadcrumb="SuperAdmin / Logs de Auditoría" />
      <ListTable 
        columnsDef={columns} 
        data={formattedData} 
        handleAddRecord={() => {}}
        showAddButton={false}
        modelLabels={{ singularName: "Log", pluralName: "Logs" }}
      />
    </div>
  );
}
