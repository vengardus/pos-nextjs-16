import { PageHeader } from "@/components/common/typography/page-header";
import { logsGetAllCached } from "@/server/modules/logs/next/cache/logs.cache";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { format } from "date-fns";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppConstants } from "@/shared/constants/app.constants";

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const pageSize = AppConstants.DEFAULT_PAGE_SIZE;

  const resp = await logsGetAllCached(page, pageSize);

  if (!resp.success) {
    return <ShowPageMessage errorMessage={resp.message} />;
  }

  const logs = resp.data;
  const totalPages = resp.pagination?.totalPages ?? 1;

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <PageHeader title="Logs del Sistema" breadcrumb={[{ label: "Super Admin" }, { label: "Logs" }]} />
      </div>

      <div className="flex-1 overflow-hidden border border-border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-left font-semibold">Acción</th>
                <th className="p-4 text-left font-semibold">Descripción</th>
                <th className="p-4 text-left font-semibold">Usuario</th>
                <th className="p-4 text-left font-semibold">País</th>
                <th className="p-4 text-left font-semibold">Disp.</th>
                <th className="p-4 text-left font-semibold">Fecha</th>
                <th className="p-4 text-left font-semibold">Zona horaria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-muted/50">
                  <td className="p-4 font-mono text-primary">{log.action}</td>
                  <td className="p-4 text-muted-foreground">{log.description}</td>
                  <td className="p-4 text-muted-foreground">{log.User?.email ?? "N/A"}</td>
                  <td className="p-4 text-muted-foreground">{log.countryCode ?? "-"}</td>
                  <td className="p-4 text-muted-foreground">{log.deviceType ?? "-"}</td>
                  <td className="p-4 text-muted-foreground">{format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss")}</td>
                  <td className="p-4 text-muted-foreground">{log.timezone ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between shrink-0 bg-muted/20">
          <Link
            href={`?page=${page - 1}`}
            className={`flex items-center gap-2 text-sm font-medium ${page <= 1 ? "pointer-events-none opacity-50" : "hover:text-primary"}`}
          >
            <ChevronLeft size={16} /> Anterior
          </Link>
          <span className="text-sm font-medium text-muted-foreground">Página {page} de {totalPages}</span>
          <Link
            href={`?page=${page + 1}`}
            className={`flex items-center gap-2 text-sm font-medium ${page >= totalPages ? "pointer-events-none opacity-50" : "hover:text-primary"}`}
          >
            Siguiente <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
