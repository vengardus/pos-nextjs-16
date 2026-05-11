"use client";

import { useEffect, useState } from "react";
import { PieChart as PieChartIcon, TrendingUp } from "lucide-react";
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

import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
import type { CashRegisterMovementTotal } from "@/server/modules/cash-register-movement/domain/cash-register-movement-total-summary.interface";
import { AppConstants } from "@/shared/constants/app.constants";
import { useDateRangeStore } from "@/stores/dashboard/date-range.store";
import { dateToStringLocal } from "@/utils/date/date-to-string-local";
import GenericPieChart from "@/components/common/charts/generic-pie-chart";
import { updateTagsAction } from "@/server/next/actions/updateTags.action";
import { cashRegisterMovementGetTotalsAction } from "@/server/modules/cash-register-movement/next/actions/cash-register-movement.get-totals.action";
import { useCashMovementsBroadcast } from "@/app/(features)/dashboard/hooks/supabase/use-realtime-broadcast";

interface SalesPieChartProps {
  companyId: string;
  paymentMethods: PaymentMethod[];
}

export function SalesPieChart({ companyId, paymentMethods }: SalesPieChartProps) {
  console.log("[SalesPieChart] MOUNT");

  const startDate = useDateRangeStore((state) => state.startDate);
  const endDate = useDateRangeStore((state) => state.endDate);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});
  const [totalSales, setTotalSales] = useState(0);

  const [revalidate, setRevalidate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { updated, reset } = useCashMovementsBroadcast();


  useEffect(() => {
    const revalidateMovements = async () => {
      console.log("revalidateMovements!!!");
      await updateTagsAction([
        `cash-register-movements-totals-${companyId}`,
        `top-selling-products-${companyId}`,
      ]);
    };

    if (updated) {
      console.log("updated real time!!!!");
      revalidateMovements();
      setRevalidate((prev) => !prev);
      reset();
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
            color: item.color?.length ? item.color : AppConstants.DEFAULT_VALUES.colors.chart,
          };
          return acc;
        }, {} as ChartConfig);

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
  }, [startDate, endDate, paymentMethods, revalidate, companyId]);

  return (
    <Card className="flex flex-col mx-auto w-full h-full border border-border/50 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden">
      <CardHeader className="p-6 border-b border-border/40 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <PieChartIcon size={20} />
          </div>
          <div>
            <CardTitle className="text-lg font-bold tracking-tight">Distribución de Ventas</CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              {dateToStringLocal(startDate)} al {dateToStringLocal(endDate)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Cargando datos en tiempo real...</p>
          </div>
        ) : chartData.length <= 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 opacity-40">
            <PieChartIcon size={48} className="text-muted-foreground" />
            <p className="text-sm font-medium">No hay ventas registradas en este periodo</p>
          </div>
        ) : (
          <div className="w-full h-[300px]">
            <GenericPieChart data={chartData} config={chartConfig} valueKey="value" nameKey="tag" />
          </div>
        )}
      </CardContent>

      {!isLoading && chartData.length > 0 && (
        <CardFooter className="p-6 bg-muted/30 border-t border-border/40 flex flex-col gap-4">
          <div className="w-full p-4 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Acumulado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-foreground">S/. {totalSales.toFixed(2)}</span>
              <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded">
                <TrendingUp size={14} />
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
