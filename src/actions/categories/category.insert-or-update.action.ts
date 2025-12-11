"use server";

import { revalidatePath, revalidateTag /*updateTag*/ } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Category } from "@/types/interfaces/category/category.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { CacheConfig } from "@/config/cache.config";
import { CategoryUpsertServerSchema } from "@/lib/schemas/category.upsert.server.schema";

// Configuration Cloudinary
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const categoryInsertOrUpdate = async (
  category: Category,
  fileList: FileList | []
): Promise<ResponseAction> => {
  console.log("categoryInsertOrUpdate action called with category:", category);

  const resp = initResponseAction();
  const { id, createdAt, updatedAt, ...rest } = category;
  //console.log(id, createdAt); //no usada intencionalmente

  try {
    // valida categroy base
    console.log("Validating category data:", rest);
    const restValidate = CategoryUpsertServerSchema.parse(rest);
    console.log("Validated category data:", restValidate);
    // Procesa de carga y guardado de imagenes
    // Convierte FileList a Array de File y filtra los no Files
    const fileArray = Array.from(fileList).filter(
      (file) => file instanceof File
    );
    const respImages = await uploadImages(fileArray);

    if (!respImages.success || !respImages.data)
      throw new Error(respImages.message);

    let proccesCategory: Category;

    // Determinar si es create or updatex
    if (id) {
      // Update
      proccesCategory = await prisma.categoryModel.update({
        where: {
          id,
        },
        data: {
          ...restValidate,
          //imageUrl: respImages.data[0],
        },
      });
    } else {
      // create
      proccesCategory = await prisma.categoryModel.create({
        data: {
          ...restValidate,
          imageUrl: respImages.data[0],
        },
      });
    }
    resp.data = proccesCategory;
    resp.success = true;

    //updateTag(`categories-${proccesCategory.companyId}`);
    revalidateTag(
      `categories-${proccesCategory.companyId}`,
      CacheConfig.CacheDurations
    );
    revalidatePath("/config/categories");
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
