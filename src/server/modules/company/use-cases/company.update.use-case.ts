import "server-only";

import { v2 as cloudinary } from "cloudinary";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Company } from "@/server/modules/company/domain/company.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { getImagePublicIdFromCloudinary } from "@/utils/media/cloudinary.utils";
import { initResponseAction } from "@/utils/response/init-response-action";
import { companyUpdateRepository } from "../repository/company.update.repository";

// Configuration Cloudinary
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

type UploadImagesResponse = {
  success: boolean;
  data: (string | null)[] | null;
  message?: string;
};

export const companyUpdateUseCase = async (
  company: Company,
  fileList: FileList | []
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  const { id, ...rest } = company;
  console.log(id); //no usada intencionalmente

  try {
    let proccesCompany: Company = company;

    const oldImageUrl = company.imageUrl;

    // delete old image
    if (fileList.length > 0 && oldImageUrl) {
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

    if (!respImages.success || !respImages.data) throw new Error(resp.message);

    // Update company
    proccesCompany = await companyUpdateRepository(id, {
      ...rest,
      imageUrl: respImages.data[0] ?? rest.imageUrl,
    });

    resp.data = proccesCompany;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};

const uploadImages = async (images: File[]): Promise<UploadImagesResponse> => {
  const resp: UploadImagesResponse = {
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
