"use server";

import { revalidatePath, updateTag } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Company } from "@/types/interfaces/company/company.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { getImagePublicIdFromCloudinary } from "@/utils/media/cloudinary.utils";

// Configuration Cloudinary
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const companyUpdate = async (
  company: Company,
  fileList: FileList | []
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  const { id, ...rest } = company;
  console.log(id); //no usada intencionalmente

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let proccesCompany: Company = company;

      const oldImageUrl = company.imageUrl;

      // delete old image
      if ( fileList.length > 0 && oldImageUrl) {
        const imagePublicId = getImagePublicIdFromCloudinary(oldImageUrl!);
        const deleteOk = await deleteImage(imagePublicId!);
        if (!deleteOk) throw new Error("Error al eliminar imagen");
      }
      
      // Procesa de carga y guardado de imagenes
      // Convierte FileList a Array de File y filtra los no Files
      const fileArray = Array.from(fileList).filter(
        (file) => file instanceof File
      );
      const respImages = await uploadImages(fileArray);

      if (!respImages.success || !respImages.data)
        throw new Error(resp.message);

      // Update company
      proccesCompany = await tx.companyModel.update({
        where: {
          id,
        },
        data: {
          ...rest,
          imageUrl: respImages.data[0] ?? rest.imageUrl,
        },
      });

      return {
        proccesCompany,
      };
    });
    resp.data = prismaTx.proccesCompany;
    resp.success = true;

    updateTag(`company-${prismaTx.proccesCompany.userId}`);	
    revalidatePath("/config/companies/general");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};

const uploadImages = async (
  images: File[]
): Promise<{
  success: boolean;
  data: (string | null)[] | null;
  message?: string;
}> => {
  const resp: {
    success: boolean;
    data: (string | null)[] | null;
    message?: string;
  } = {
    success: false,
    data: null,
  };

  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");

        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`, {
            folder: "pos/companies",
          })
          .then((r) => r.secure_url);
      } catch (error) {
        console.log("Error procesando imagen", error);
        return null;
      }
    });

    // si ocurrió un error en el uploaPromise, el Promise.all emviara al catch externo
    const uploadImages = await Promise.all(uploadPromises);

    resp.success = true;
    resp.data = uploadImages;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};

const deleteImage = async (publicId: string): Promise<boolean> => {
  let success = false;
  console.log("publicId", publicId);
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`result delete image cloudinary id: ${publicId}`, result);
    success = true;
  } catch (error) {
    console.log("Error eliminando imagen", error);
  }
  return success;
};
