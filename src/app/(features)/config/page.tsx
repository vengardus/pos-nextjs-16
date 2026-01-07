// import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppConstants } from "@/shared/constants/app.constants";
import { Card, CardContent } from "@/components/ui/card";
// import LoadingPage from "../loading";

export default async function ConfigPage() {
  return (
    // <Suspense fallback={<LoadingPage />}>
    <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3 bg-[url('/fondocuadros.svg')] bg-contain bg-center [background-repeat:no-repeat,repeat]">
      {AppConstants.CONFIG_MODULES.map((item) => (
        <Card key={item.title} className="py-5 card ">
          <CardContent>
            <Link
              href={item.link}
              className="flex flex-col gap-2 w-full justify-center items-center filter grayscale  hover:grayscale-0 "
            >
              <Image
                src={item.icon}
                alt={item.title}
                width={100}
                height={100}
                priority={
                  item.icon == "https://i.ibb.co/85zJ6yG/caja-del-paquete.png"
                    ? true
                    : false
                }
              />
              <p className="text-center capitalize font-bold">{item.title}</p>
              <p className="text-center capitalize text-sm">{item.subtitle}</p>
            </Link>
          </CardContent>
        </Card>
      ))}
    </section>
    // </Suspense>
  );
}
