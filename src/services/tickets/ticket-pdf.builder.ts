
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

pdfMake.vfs = pdfFonts.vfs

interface CreateTicketPDFResult {
    success: boolean;
    content: string | null;
    message: string;
}

export const createTicketPDF = async (props:TDocumentDefinitions, output = "print"): Promise<CreateTicketPDFResult> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return {
        success: false,
        content: null,
        message: "No se puede generar el PDF en el servidor",
      }
    }
    
    try {
      const {
        pageSize = {
          width: 226.77,
          height: 841.88,
        },
        pageMargins = [5.66, 5.66, 5.66, 5.66],
        info = {},
        styles = {},
        content,
      } = props;
      const docDefinitions:TDocumentDefinitions = {
        pageSize,
        pageMargins,
        info,
        styles,
        content,  
      };

      if (output === "b64") {
        const pdfMakeCreatePdf = pdfMake.createPdf(docDefinitions);
        pdfMakeCreatePdf.getBase64((data)=>{
            resolve({
                success: true,
                content: data,
                message: "Archivo generado correctamente",
            })
        })
        return
      } else if (output === "print") {
        const pdfMakeCreatePdf = pdfMake.createPdf(docDefinitions);
        pdfMakeCreatePdf.getBase64(async (data) => {
          const { default: printJS } = await import("print-js");
            printJS({
                printable: data,
                type: "pdf",
                base64: true
            })
            resolve({
                success: true,
                content: null,
                message: "Documento enviado a impresión correctamente",
            })
        })
        return
      }
      reject({
        success: false,
        content: null,
        message: "Debe enviar un tipo de salida",
      })
    } catch (error) {
      reject({
        success: false,
        content: null,
        message: "Ocurrio un error al generar el PDF: " + error,
      });
    }
  });
};
