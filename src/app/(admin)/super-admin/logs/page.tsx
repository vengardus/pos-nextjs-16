import { PageHeader } from "@/components/common/typography/page-header";
import { logsGetAllCached } from "@/server/modules/logs/next/cache/logs.cache";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const pageSize = 20;

  const resp = await logsGetAllCached(page, pageSize);

  if (!resp.success) {
    return <ShowPageMessage errorMessage={resp.message} />;
  }

  const logs = resp.data;
  const totalPages = resp.pagination?.totalPages ?? 1;

  return (
    <div className="flex h-full flex-col p-6 bg-[fondocuadros.svg] bg-[length:60%] bg-center [background-repeat:no-repeat]">
      <div className="mb-8">
        <PageHeader title="Logs del Sistema" breadcrumb={[{ label: "Super Admin" }, { label: "Logs" }]} />
      </div>

      <Card className="flex-1 overflow-hidden shadow-lg border border-border/50 bg-background/80 backdrop-blur-sm flex flex-col">
        <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
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
            <tbody className="divide-y divide-border/40">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-muted/20">
                  <td className="p-4 font-mono text-primary">{log.action}</td>
                  <td className="p-4 text-muted-foreground">{log.description}</td>
                  <td className="p-4 text-muted-foreground">{log.userId ?? "N/A"}</td>
                  <td className="p-4 text-muted-foreground">{log.countryCode ?? "-"}</td>
                  <td className="p-4 text-muted-foreground">{log.deviceType ?? "-"}</td>
                  <td className="p-4 text-muted-foreground">{format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss")}</td>
                  <td className="p-4 text-muted-foreground">{log.timezone ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
        <div className="p-4 border-t border-border/40 flex items-center justify-between">
          <Link
            href={`?page=${page - 1}`}
            className={`flex items-center gap-2 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
          >
            <ChevronLeft size={16} /> Anterior
          </Link>
          <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
          <Link
            href={`?page=${page + 1}`}
            className={`flex items-center gap-2 text-sm ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
          >
            Siguiente <ChevronRight size={16} />
          </Link>
        </div>
      </Card>
    </div>
  );
}
