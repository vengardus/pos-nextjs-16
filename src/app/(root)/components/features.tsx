"use client";

import { Card, CardContent } from "@/components/ui/card";

export const Features = () => {
  const features = [
    { icon: "🏢", title: "Multi-empresa" },
    { icon: "🏪", title: "Multi-sucursal" },
    { icon: "🧾", title: "Multi-caja" },
    { icon: "🏭", title: "Multi-almacen" },
    { icon: "🖨️", title: "Impresión de tickets" },
  ];

  const benefits = [
    {
      icon: "📊",
      title: "Gestión Integral",
      description: "Domina tu negocio: Ventas, inventario y clientes centralizados.",
    },
    {
      icon: "⚙️",
      title: "Productividad",
      description: "Automatiza tareas y minimiza errores con herramientas ágiles.",
    },
    {
      icon: "📈",
      title: "Decisiones con Datos",
      description: "Análisis en tiempo real para entender y potenciar tu negocio.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column - Benefits */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">Por qué elegirnos</h2>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Revoluciona tu negocio con <span className="text-primary">POS-EF2R</span>
            </h1>
          </div>

          <div className="grid gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-l-4 border-l-primary bg-muted/20 shadow-none">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="text-3xl bg-background/50 p-2 rounded-lg">{benefit.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column - Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-background shadow-md border-border/50 hover:border-primary/50 transition-colors"
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="font-medium text-foreground">{feature.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
