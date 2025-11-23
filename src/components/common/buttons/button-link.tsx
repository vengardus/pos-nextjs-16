import { ArrowLeftIcon } from "lucide-react";

interface LinkSSProps {
  label: string;
  handleAction: () => void;
}
export const ButtonLink = ({ label, handleAction }: LinkSSProps) => {
  return (
    <div className="flex items-center justify-center">
    <ArrowLeftIcon className="mr-2 h-6 w-6" />
    <button className="link" onClick={handleAction}>
      {label}
    </button>
    </div>
  );
};
