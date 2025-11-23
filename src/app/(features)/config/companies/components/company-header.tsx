import type { Company } from "@/types/interfaces/company/company.interface";
import Image from "next/image";

interface CompanyHeaderProps {
  company: Company;
}
export const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  return (
    <section className="border border-foreground/10 rounded-xl mx-auto h-[100px] grid grid-cols-2 bg-foreground/5">
      {/* Contenedor de la imagen */}
      <div className="flex items-center justify-center h-full overflow-hidden">
        <Image
          src={company.imageUrl ?? "/placeholder.jpg"}
          alt={company.name}
          width={100}
          height={100}
          className="object-cover w-full h-full p-2" // Ajusta la imagen al contenedor
        />
      </div>

      {/* Contenedor del texto */}
      <div className="flex flex-col justify-center items-center l">
        <h3 className="font-bold text-center text-2xl">{company.name}</h3>
      </div>
    </section>
  );
};
