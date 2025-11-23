import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CardTotalProps {
  children?: React.ReactNode;
  title: string;
  value: string;
  note: string;
}

export const CardTotal = ({ children, title, value, note }: CardTotalProps) => {
  return (
    <Card className="">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>{title}</CardTitle>
        {children}
      </CardHeader>
      <CardContent className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <div>(en desarrollo...)</div>
          <div className="text-xl font-bold">{value}</div>
        </div>
      </CardContent>
      <CardFooter>{note}</CardFooter>
    </Card>
  );
};
