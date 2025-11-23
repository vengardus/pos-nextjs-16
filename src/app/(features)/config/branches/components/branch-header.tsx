import { Title } from "../../../../../components/common/titles/Title";

export const BranchHeader = () => {
  return (
    <header className="flex flex-col gap-3 items-center hover:cursor-pointer">
      <Title label="Cajas por Sucursal" />
      <p>Gestiona tus sucursales y cajas</p>
    </header>
  );
};
