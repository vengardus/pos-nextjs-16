"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";

import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import type { CashRegisterMovementTotal } from "@/types/interfaces/cash-register-movement/cash-register-movement-total-summary.interface";
import { AppConstants } from "@/constants/app.constants";
import { useRealtimeUpdate } from "@/hooks/supabase/use-realtime-update";
import { useDateRangeStore } from "@/stores/dashboard/date-range.store";
import { dateToStringLocal } from "@/utils/date/date-to-string-local";
import GenericPieChart from "@/components/common/charts/generic-pie-chart";
import { useRealTimeStore } from "@/stores/general/real-time.store";
import { updateTags } from "@/infrastructure/cache/revalidate-tags";
import { cashRegisterMovementGetTotalsAction } from "@/actions/cash-register-movement/cash-register-movement.get-totals.action";

interface SalesPieChartProps {
  companyId: string;
  paymentMethods: PaymentMethod[];
}

export function SalesPieChart({ companyId, paymentMethods }: SalesPieChartProps) {
  const startDate = useDateRangeStore((state) => state.startDate);
  const endDate = useDateRangeStore((state) => state.endDate);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});
  const [totalSales, setTotalSales] = useState(0);

  const [revalidate, setRevalidate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { reset } = useRealtimeUpdate("cash_register_movements");
  const updated = useRealTimeStore((state) => state.updated);

  useEffect(() => {
    const revalidateMovements = async () => {
      console.log("revalidateMovements!!!");
      // revalidate para forzar consulta a la BD (getTotals() mas abajo en el otro useEffect)
      await updateTags([
        `cash-register-movements-totals-${companyId}`,
        `top-selling-products-${companyId}`,
      ]);
    };

    if (updated) {
      console.log("updated real time!!!!");
      revalidateMovements();
      setRevalidate(true);
      reset(); // Resetea el estado del hook para esperar el siguiente cambio
      console.log("reset real time!!");
    }
  }, [updated, reset, setRevalidate, companyId]);

  useEffect(() => {
    const getTotals = async () => {
      setIsLoading(true);

      console.log("Execute real time");
      const resp = await cashRegisterMovementGetTotalsAction({
        typeQuery: "by-date-range",
        cashRegisterClosureId: "",
        paymentMethods,
        startDateUTC: startDate,
        endDateUTC: endDate,
        companyId,
      });
      if (!resp.success) {
        toast.error("Error al obtener totales: ", {
          description: resp.message,
        });
        setIsLoading(false);
        return;
      }

      const totals = resp.data as CashRegisterMovementTotal;
      const chartDate = totals.summary
        .filter((item) => item.type == "sales" && !item.isAccumulatedTotal)
        .map((item) => {
          return {
            tag: item.code,
            value: item.amount,
            fill: item.color?.length ? item.color : AppConstants.DEFAULT_VALUES.colors.chart,
            label: item.label,
          };
        });

      const chartConfig = totals.summary
        .filter(
          (item) => item.type == "sales" && !item.isAccumulatedTotal && item.code !== undefined
        )
        .reduce((acc, item) => {
          acc[item.code] = {
            label: item.label,
            color: item.color?.length ? item.color : AppConstants.DEFAULT_VALUES.colors.chart, // Agrega color solo si está definido
          };
          return acc;
        }, {} as ChartConfig);

      // Agregar la entrada "value" manualmente
      chartConfig.value = {
        label: "Ventas S/.",
      };

      setChartData(chartDate);
      setChartConfig(chartConfig);

      const totalSales = totals.summary.find(
        (item) => item.type == "sales" && item.isAccumulatedTotal
      );
      if (totalSales) setTotalSales(totalSales.amount);

      setIsLoading(false);
    };

    if (!paymentMethods.length) return;

    getTotals();
    setRevalidate(false);
  }, [startDate, endDate, paymentMethods, revalidate, companyId]);

  return (
    <Card className="flex flex-col mx-auto w-full card">
      <CardHeader className="items-center pb-0">
        <CardTitle className="grid ">
          Ventas por método de pago <span className="text-xs text-center">(tiempo real)</span>
        </CardTitle>
        <CardDescription>
          {dateToStringLocal(startDate)} - {dateToStringLocal(endDate)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="my-7 mx-auto w-full flex justify-center">Cargando datos...</div>
        ) : chartData.length <= 0 && !isLoading ? (
          <div className="my-7 mx-auto w-full flex justify-center">No hay datos para mostrar</div>
        ) : (
          <GenericPieChart data={chartData} config={chartConfig} valueKey="value" nameKey="tag" />
        )}
      </CardContent>
      {!(isLoading || (chartData.length <= 0 && !isLoading)) && (
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Total ventas en este periodo S/. {totalSales.toFixed(2)}{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground"></div>
        </CardFooter>
      )}
    </Card>
  );
}
