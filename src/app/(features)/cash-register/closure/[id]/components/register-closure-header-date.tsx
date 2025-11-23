"use client";

import { Title } from "@/components/common/titles/Title";
import { format } from "date-fns";

interface RegisterClosureHeaderDateProps {
  dateStart: Date;
  dateEnd: Date;
}
export const RegisterClosureHeaderDate = ({
  dateStart,
  dateEnd,
}: RegisterClosureHeaderDateProps) => {
  return (
    <Title
      label={`Corte de caja del ${format(dateStart, "dd/MM/yyyy HH:mm:ss")}
       al ${format(dateEnd, "dd/MM/yyyy HH:mm:ss")}`}
    ></Title>
  );
};
