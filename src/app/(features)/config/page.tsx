import Link from "next/link";
import Image from "next/image";
import { AppConstants } from "@/shared/constants/app.constants";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/typography/page-header";
import { getAuthCached } from "@/server/modules/auth/next/cache/auth.get-session.cache";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";

export default async function ConfigPage() {
  const session = await getAuthCached();
  const userRole = session?.data?.sessionUser?.role;

  const filteredModules = AppConstants.CONFIG_MODULES.filter(item => {
    if (userRole === UserRole.GUEST && item.name === ModuleEnum.company) return false;
    return true;
  });

  return (
    <div className="flex min-h-full flex-col p-6 pb-8 bg-[length:60%] bg-center [background-repeat:no-repeat]">
      <div className="mb-8">
        <PageHeader 
          title="Configuración" 
          breadcrumb={[
            { label: "Inicio", href: "/" },
            { label: "Configuración" }
          ]} 
        />
      </div>

      <section className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredModules.map((item) => (
          <Link
            key={item.title}
            href={item.link}
            className="group block transition-all duration-300 hover:-translate-y-1"
          >
            <Card className="h-full border border-border/50 bg-background/80 backdrop-blur-sm shadow-md hover:shadow-xl hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
                <div className="relative w-20 h-20 transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    fill
                    className="object-contain"
                    priority={item.icon === "https://i.ibb.co/85zJ6yG/caja-del-paquete.png"}
                  />
                </div>
                <div className="space-y-1 text-center">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors capitalize">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {item.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
