"use client";

import { useCartStore } from "@/stores/cart/cart.store";
import { Button } from "@/components/ui/button";

interface PosTicketProps {
  handleCloseForm: () => void;
  output?: string;
}


export const PosTicket = ({
  handleCloseForm,
}: PosTicketProps) => {
  const b64 = useCartStore((state) => state.b64);

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Button id="btn-ticket-pos" onClick={handleCloseForm} className="btn-save">Cerrar</Button>

      {b64 && (
        <iframe
          style={{ width: "100%", height: "500px" }}
          src={`data:application/pdf;base64,${b64}`}
          width="100%"
          height="500px"
        />
      )}
    </div>
  );
};
