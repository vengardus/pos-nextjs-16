import prisma from "@/server/db/prisma";

export const productGetByBarcodeRepository = async (barcode: string, companyId: string) => {
  return await prisma.productModel.findFirst({
    where: {
      barcode: barcode,
      companyId: companyId,
    },
    include: {
      Category: true,
      WareHouse: true,
      MultiPrice: true,
    },
  });
};
