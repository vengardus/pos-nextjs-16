"use client";
import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { UserWithRelations } from "@/server/modules/user/domain/user-with-relations.interface";
import { CashRegisterMovementCategoryEnum } from "@/types/enums/cash-register-movement-category.enum";
import { dateTimeToStringLocal } from "@/utils/date/date-time-to-string-local";

interface UserItemProps {
  user: UserWithRelations;
}

export const UserItem = ({ user }: UserItemProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const togglePayments = (saleId: string) => {
    setExpanded(expanded === saleId ? null : saleId);
  };

  return (
    <Card className="p-3 card">
      <CardTitle className="text-md flex flex-col items-center bg-foreground/5 py-1">
        <p className="font-semibold text-xl">{user.name}</p>
        <p>{user.email}</p>
        <p>{dateTimeToStringLocal(user.createdAt!)}</p>
      </CardTitle>
      <CardContent className="mt-2 p-0">
        <section className="mt-2 flex flex-col gap-2">
          <h2>Ventas</h2>
          <article className="grid grid-cols-[5%_40%_40%_15%] items-center text-center border-b-2 ">
            <span>#</span>
            <span>Fecha</span>
            <span>Monto</span>
            <span>Ver</span>
          </article>
          {!user.Sale || user.Sale.length < 1 ? (
            <article>No tiene ventas</article>
          ) : (
            user.Sale.map((sale, index) => (
              <article key={sale.id} className="flex flex-col gap-1">
                <section className="grid grid-cols-[5%_40%_40%_15%] items-center text-center">
                  <span>{index + 1}.</span>
                  <span>{dateTimeToStringLocal(sale.createdAt!)}</span>
                  <span className="">{sale.totalAmount.toFixed(2)}</span>
                  <button
                    onClick={() => togglePayments(sale.id)}
                    className=" text-blue-400 hover:underline"
                  >
                    {expanded === sale.id ? "menos" : "mas"}
                  </button>
                </section>

                {expanded === sale.id && (
                  <section className="pl-7">
                    <h2>Items</h2>
                    <article className="grid grid-cols-[40%_20%_20%_20%] text-center border-b-2">
                      <span>Nombre</span>
                      <span>Cant</span>
                      <span>P.U</span>
                      <span>SubTot</span>
                    </article>
                    <section className="flex flex-col pl-7">
                      {sale.SaleDetail.map((saleDetail) => (
                        <article
                          key={saleDetail.id}
                          className="grid grid-cols-[40%_20%_20%_20%] text-center"
                        >
                          <span className="text-start">{saleDetail.Product!.name}</span>
                          <span>{saleDetail.quantity}</span>
                          <span>{saleDetail.Product!.salePrice.toFixed(2)}</span>
                          <span>{saleDetail.total.toFixed(2)}</span>
                        </article>
                      ))}
                    </section>

                    <section className="flex flex-col gap-1 mt-1">
                      <h2>Pagos</h2>
                      <article className="grid grid-cols-3 text-center border-b-2">
                        <span>Met.Pago</span>
                        <span>Monto</span>
                        <span>Vuelto</span>
                      </article>
                      {sale.CashRegisterMovement?.filter(
                        (cashRegisterMovement) =>
                          cashRegisterMovement.movementCategory ===
                          CashRegisterMovementCategoryEnum.PAYMENT_METHOD
                      ).map((cashRegisterMovement) => (
                        <article
                          key={cashRegisterMovement.id}
                          className="grid grid-cols-3 pl-7 text-center"
                        >
                          <span>{cashRegisterMovement.movementType}</span>
                          <span>{cashRegisterMovement.amount.toFixed(2)}</span>
                          <span>
                            {cashRegisterMovement.changeDue.toFixed(2)}
                          </span>
                        </article>
                      ))}
                    </section>
                  </section>
                )}
              </article>
            ))
          )}
        </section>
      </CardContent>
    </Card>
  );
};
