import type { StyleDictionary } from "pdfmake/interfaces";

export const TICKET_SALE_STYLES:StyleDictionary = {
  header: {
    fontSize: 9,
    bold: true,
    alignment: "center",
  },
  tHeaderLabel: {
    fontSize: 8,
    alignment: "right",
  },
  tHeaderValue: {
    fontSize: 8,
    bold: true,
  },
  tProductsHeader: {
    fontSize: 8.5,
    bold: true,
  },
  tProductsBody: {
    fontSize: 9,
  },
  tTotals: {
    fontSize: 9,
    bold: true,
    alignment: "right",
  },
  tClientLabel: {
    fontSize: 8,
    alignment: "right",
  },
  tClientValue: {
    fontSize: 8,
    bold: true,
  },
  text: {
    fontSize: 8,
    alignment: "center",
  },
  link: {
    fontSize: 8,
    bold: true,
    margin: [0, 0, 0, 4],
    alignment: "center",
  },
};
