"use client";

export const Features = () => {
  const features = [
    {
      icon: "🏢",
      title: "Multi-empresa",
      color: "#FFF5F5",
    },
    {
      icon: "🏪",
      title: "Multi-sucursal",
      color: "#FFF5F5",
    },
    {
      icon: "🧾",
      title: "Multi-caja",
      color: "#F5FBFF",
    },
    {
      icon: "🏭",
      title: "Multi-almacen",
      color: "#FFF5F5",
    },
    {
      icon: "🖨️",
      title: "Imprime comprobante",
      subtitle: undefined,
      color: "#F5FBFF",
    },
  ];

  const benefits = [
    {
      icon: "📊",
      title: "Gestión Integral",
      description:
        "Domina tu negocio desde un solo lugar: Gestión completa de ventas, inventario y clientes.",
    },
    {
      icon: "⚙️",
      title: "Potencia tu Productividad",
      description:
        "mpulsa tu rendimiento: Herramientas de automatización para simplificar tareas y minimizar errores.",
    },
    {
      icon: "📈",
      title: "Decisiones Basadas en Datos",
      description:
        "Toma el control con información: Análisis en tiempo real para entender tu negocio y actuar con seguridad.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-8 md:pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column */}
        <div className="space-y-8">
          <h1 className="text-3xl md:text-3xl font-bold text-center md:text-left flex flex-col gap-1">
            <span className="text-amber-600">POS-EF2R</span>
            <span>Revoluciona tu Negocio</span>
          </h1>

          <div className="space-y-6 mt-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-gray-700  p-3 rounded-lg text-2xl">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-amber-600">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-500 mt-1">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="relative">
          <div className="bg-blue-200 rounded-full w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto opacity-70 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"></div>
          <div className="relative z-10 space-y-4 max-w-[320px] mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-300 rounded-xl shadow-md p-4 flex items-center gap-3 transition-transform duration-200 hover:translate-x-2"
                style={{
                  //backgroundColor: feature.color,
                  marginLeft: index % 2 === 0 ? "0px" : "30px", // Intercalar posición
                }}
              >
                <div className="text-2xl">{feature.icon}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  {feature.subtitle && (
                    <p className="text-sm text-gray-500">{feature.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
