import { PieChart, Pie, LabelList } from "recharts";
import {
    ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

interface PieChartProps<T> {
  data: T[];
  config: ChartConfig;
  valueKey: keyof T;
  nameKey: keyof T;
}

export default function GenericPieChart<T extends Record<string, any>>({
  data,
  config,
  valueKey,
  nameKey,
}: PieChartProps<T>) {
    console.log("data!!", data);
  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
    >
      <PieChart>
        <ChartTooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            console.log("payload", payload);
            const data = payload[0]; // Primer conjunto de datos del tooltip
            const value = Number(data.value).toFixed(2); // Formatear a 2 decimales

            return (
              <div className="bg-background p-2 shadow-md rounded-md text-sm">
                <p
                  className="w-3 h-3"
                  style={{ backgroundColor: data.payload.fill }}
                ></p>
                <p className="font-semibold">{data.payload.label}</p>
                <p className="text-foreground">Visitas: {value}</p>
              </div>
            );
          }}
        />
        <Pie data={data} dataKey={valueKey as string}>
          <LabelList
            dataKey={nameKey as string}
            className="fill-background"
            stroke="none"
            fontSize={12}
            formatter={(value: keyof typeof config) =>
              config[value]?.label
            }
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
