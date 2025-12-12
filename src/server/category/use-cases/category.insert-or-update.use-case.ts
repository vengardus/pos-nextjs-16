import "server-only";
import { v2 as cloudinary } from "cloudinary";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Category } from "@/types/interfaces/category/category.interface";
import { CategoryInputSchema } from "@/server/category/domain/category.input.schema";
import { categoryInsertOrUpdateRepository } from "../repository/category.insert-or-update.repository";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

// Configuration Cloudinary
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const categoryInsertOrUpdateUseCase = async (
  category: Category,
  fileList: FileList | []
): Promise<ResponseAction> => {
  console.log("categoryInsertOrUpdateUseCase called with category:", category);

  const resp = initResponseAction();
  const { id, createdAt, updatedAt, ...rest } = category;
  //console.log(id, createdAt); //no usada intencionalmente

  try {
    // valida categroy base
    const restValidate = CategoryInputSchema.parse(rest);
    
    // Convierte FileList a Array de File y filtra los no Files
    const fileArray = Array.from(fileList).filter(
        (file) => file instanceof File
    );
    // Procesa de carga y guardado de imagenes
    const respImages = await uploadImages(fileArray);

    if (!respImages.success || !respImages.data)
      throw new Error(respImages.message);

    const proccesCategory = await categoryInsertOrUpdateRepository({
      ...(id && id.trim() !== "" ? { id } : {}),
      ...restValidate,
      imageUrl: respImages.data ? respImages.data[0] : null,
    });

    resp.success = true;
    resp.data = proccesCategory;
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
            folder: "pos/categories",
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
