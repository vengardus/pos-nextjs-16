import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

interface LinkSSProps {
  label: string;
  href: string;
}
export const LinkSS = ({ label, href }: LinkSSProps) => {
  return (
    <div className="flex items-center">
      <ArrowLeftIcon className="mr-2 h-6 w-6" />
      <Link href={href} className="link">
        {label}
      </Link>
    </div>
  );
};
