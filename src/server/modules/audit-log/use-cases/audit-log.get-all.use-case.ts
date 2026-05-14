import { auditLogGetAllRepository } from "../repository/audit-log.get-all.repository";
import { initResponseAction } from "@/utils/response/init-response-action";

export const auditLogGetAllUseCase = async (page: number, pageSize: number) => {
  const resp = initResponseAction();
  try {
    const { data, total } = await auditLogGetAllRepository(page, pageSize);
    resp.data = data;
    resp.pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
    resp.success = true;
  } catch (error) {
    resp.message = "Error al obtener logs de auditoría";
    resp.success = false;
  }
  return resp;
};
