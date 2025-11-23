import { ButtonDashed } from "../../../../../components/common/buttons/button-dashed";

interface BranchAddProps {
  handleClick: () => void;
}
export const BranchAdd = ({ handleClick }: BranchAddProps) => {
  return <ButtonDashed label="Agregar Sucursal" handleClick={handleClick} />;
};
