"use client";

import type { TableCell, TDocumentDefinitions } from "pdfmake/interfaces";
import type { CartProduct } from "@/server/modules/sale/domain/cart-product.interface";
import { createTicketPDF } from "@/server/modules/sale/utils/ticket-pdf.builder";
import { urlToBase64 } from "@/utils/browser/urlToBase64";
import { TICKET_SALE_STYLES } from "@/server/modules/sale/utils/ticket-sale-styles";
import type { PosPayment } from "@/server/modules/sale/domain/pos-payment.interface";

interface TicketTotals {
  subTotal: number,
  tax: number,
  total: number,
  totalItems: number
}

interface TicketSaleProp  {
  logo: string,
  cart: CartProduct[],
  totals: TicketTotals,
  posPayment: PosPayment
}
export const generateSaleTicket = async (output: string, data: TicketSaleProp) => {
  if (typeof window === "undefined") {
    return {
      success: false,
      content: null,
      message: "Solo se puede generar el PDF en el navegador",
    };
  }
  const logo = await urlToBase64(data.logo);
  const content: TDocumentDefinitions["content"] = [
    ticketDataHeader(logo),
    // fecha/hora, cajero, cliemte
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["25%", "35%", "15%", "25%"],
        body: [
          ...ticketDataDateTime(),
          ...ticketDataCajero(),
          ...ticketDataClient(),
        ],
      },
      layout: "noBorders",
    },

    // items
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["20%", "20%", "30%", "30%"],
        body: [...ticketDataItemsHeader(), ...ticketDataItemsDetail(data.cart)],
      },
      layout: {
        hLineWidth: function (i) {
          return i == 2 ? 0.5 : 0;
        },
        vLineWidth: function () {
          return 0;
        },
        hLineColor: function () {
          return "#a9a9a9";
        },
      },
    },

    // Totale
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["25%", "35%", "15%", "25%"],
        body: [
          ...ticketDataTotals(data.totals),
          ...ticketDataPayment(data.posPayment),
          ...ticketDataFooter(),
        ],
      },
      layout: "noBorders",
    },

    ...ticketDataQR(),
  ];
  const response = await createTicketPDF(
    {
      content: content as TDocumentDefinitions["content"],
      styles: TICKET_SALE_STYLES,
    },
    output
  );
  return response;
};

const ticketDataHeader = (logo: string): TDocumentDefinitions["content"] => {
  return [
    {
      image: logo,
      fit: [141.73, 56.692],
      alignment: "center",
    },
    {
      text: "Nombre de la tienda",
      style: "header",
      margin: [0, 10, 0, 0],
    },
    {
      text: "Direcciòn",
      style: "header",
    },
    {
      text: "RUC",
      style: "header",
    },

    {
      text: "FACTURA ELECTRONICA",
      style: "header",
    },
    {
      text: "001-0000001",
      style: "header",
      margin: [0, 2.25, 0, 0],
    },
  ];
};

const ticketDataDateTime = (): TableCell[][] => {
  return [
    [
      {
        text: "FECHA:",
        style: "tTotals",
      },
      {
        text: "20/02/2025",
        style: "tTotals",
      },
      {
        text: "HORA:",
        style: "tTotals",
      },
      {
        text: "11:05:30",
        style: "tTotals",
      },
    ],
  ];
};

const ticketDataCajero = (): TableCell[][] => {
  return [
    [
      {
        text: "CAJERO:",
        style: "tTotals",
      },
      {
        text: "JUAN PEREZ",
        style: "tTotals",
        colSpan: 3,
      },
      {},
      {},
    ],
  ];
};

const ticketDataClient = (): TableCell[][] => {
  return [
    [
      {
        text: "CLIENTE:",
        style: "tTotals",
        alignment: "left",
        colSpan: 4,
        margin: [0, 6, 0, 0],
      },
      {},
      {},
      {},
    ],
    [
      {
        text: "NOMBRES:",
        style: "tClientLabel",
        //alignment: "left",
      },
      {
        text: "AVES DE PASO S.A",
        style: "tClientValue",
        colSpan: 3,
      },
      {},
      {},
    ],
    [
      {
        text: "DOC.ID",
        style: "tClientLabel",
      },
      {
        text: "90609077",
        style: "tClientValue",
        colSpan: 3,
      },
      {},
      {},
    ],
    [
      {
        text: "DIRECCION",
        style: "tClientLabel",
      },
      {
        text: "Calle Melancolia 123",
        style: "tClientValue",
        colSpan: 3,
      },
      {},
      {},
    ],
  ];
};

const ticketDataItemsHeader = (): TableCell[][] => {
  return [
    [
      {
        text: "CODIGO - DESCRIPCION",
        style: "tProductsHeader",
        colSpan: 4,
      },
      {},
      {},
      {},
    ],
    [
      {
        text: "CANT.",
        style: "tProductsHeader",
      },
      {
        text: "UM",
        style: "tProductsHeader",
      },
      {
        text: "PRECIO",
        style: "tProductsHeader",
      },
      {
        text: "TOTAL",
        style: "tProductsHeader",
      },
    ],
  ];
};

const ticketDataItemsDetail = (cart: CartProduct[]): TableCell[][] => {
  return cart.flatMap((item) => [
    [
      {
        text: `${item.id.slice(0, 12)} -${item.name}`,
        style: "tProductsBody",
        colSpan: 4,
      },
    ],
    [
      {
        text: item.quantity.toString(),
        style: "tProductsBody",
        alignment: "center",
      },
      {
        text: "UM",
        style: "tProductsBody",
        alignment: "center",
      },
      {
        text: item.price.toString(),
        style: "tProductsBody",
        alignment: "right",
      },
      {
        text: item.total.toString(),
        style: "tProductsBody",
        alignment: "right",
      },
    ],
  ]);
};

const ticketDataTotals = (totals:TicketTotals): TableCell[][] => {
  return [
    [
      {
        text: "SUBTOTAL: S/.",
        style: "tTotals",
        colSpan: 2,
      },
      {},
      {
        text: `${totals.subTotal.toFixed(2)}`,
        style: "tTotals",
        colSpan: 2,
      },
      {},
    ],
    [
      {
        text: "IGV: S/.",
        style: "tTotals",
        colSpan: 2,
      },
      {},
      {
        text: `${totals.tax.toFixed(2)}`,
        style: "tTotals",
        colSpan: 2,
      },
      {},
    ],
    [
      {
        text: "TOTAL: S/.",
        style: "tTotals",
        colSpan: 2,
      },
      {},
      {
        text: `${totals.total.toFixed(2)}`,
        style: "tTotals",
        colSpan: 2,
      },
      {},
    ],
    [
      {
        text: "IMPORTE EN LETRAS:",
        style: "tTotals",
        alignment: "left",
        colSpan: 4,
        margin: [0, 4, 0, 0],
      },
      {},
      {},
      {},
    ],
    [
      {
        text: "SON SESENTA Y NUEVE SOLES/100",
        style: "tTotals",
        alignment: "left",
        colSpan: 4,
        margin: [0, 4, 0, 0],
      },
      {},
      {},
      {},
    ],
  ];
};

const ticketDataPayment = (posPayment: PosPayment): TableCell[][] => {
  return [
    [
      {
        text: "FORMA DE PAGO:",
        style: "tTotals",
        alignment: "left",
        colSpan: 2,
      },
      {},
      {
        text: `${posPayment.paymentMethodId}`,
        style: "tTotals",
        colSpan: 2,
      },
      {},
    ],
    [
      {
        text: "EFECTIVO: S/.",
        style: "tTotals",
        colSpan: 2,
      },
      {},
      {
        text: `${posPayment.totalPayment.toFixed(2)}`,
        style: "tTotals",
        colSpan: 2,
      },
      {},
    ],
    // [
    //   {
    //     text: "TARJ.CREDITO: S/.",
    //     style: "tTotals",
    //     colSpan: 2,
    //   },
    //   {},
    //   {
    //     text: `${posCashing.card.toFixed(2)}`,
    //     style: "tTotals",
    //     colSpan: 2,
    //   },
    //   {},
    // ],
    // [
    //   {
    //     text: "CREDITO: S/.",
    //     style: "tTotals",
    //     colSpan: 2,
    //   },
    //   {},
    //   {
    //     text: `${posCashing.credit.toFixed(2)}`,
    //     style: "tTotals",
    //     colSpan: 2,
    //   },
    //   {},
    // ],
  ];
};

const ticketDataFooter = (): TableCell[][] => {
  return [
    [
      {
        text: "ESTIMADO CLIENTE, TIENE COMO PLAZO MAXIMO DE 5 DIAS HABILES EN RECOGER SU MERCADERIA,. DICHO ESTO SE LE COBRARIA PENALDAD DE ALMACEN POR EL MONTO DE S/.20.00 POR DIA, GRACIAS",
        alignment: "justify",
        style: "text",
        margin: [0, 5],
        colSpan: 4,
      },
    ],
  ];
};

const ticketDataQR = (): TDocumentDefinitions["content"][] => {
  return [
      {
        qr: "20603831404|03|factura|total|cliente|sdasdadasdasdasd|",
        fit: 115,
        alignment: "center",
        eccLevel: "L",
        margin: [0, 10, 0, 3],
      },
      {
        text: "Representación impresa del comprobante original. Consulta tu comprobante aquí.",
        style: "text",
        margin: [0, 7, 0, 0],
      },
      {
        text: "https://vercel.com",
        link: "https://vercel.com",
        style: "link",
      },
  ];
};
