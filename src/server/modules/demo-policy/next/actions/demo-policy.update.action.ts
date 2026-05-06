import "server-only";
import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";
import { initResponseAction } from "@/utils/response/init-response-action";

export const demoPolicyUpdateAction = async (id: string, data: any) => {
  const resp = initResponseAction();
  try {
    const updated = await prisma.demoPolicyModel.update({
      where: { id },
      data: {
        isEnabled: data.isEnabled,
        maxUsers: data.maxUsers,
        maxGuestSignupsPerIpPerDay: data.maxGuestSignupsPerIpPerDay,
        guestTtlDays: data.guestTtlDays,
      },
    });
    resp.success = true;
    resp.data = updated;
    revalidatePath("/super-admin/config/demo-policy");
  } catch (error) {
    resp.message = "Error al actualizar política.";
  }
  return resp;
};
