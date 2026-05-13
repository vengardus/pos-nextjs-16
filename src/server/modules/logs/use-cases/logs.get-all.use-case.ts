import "server-only";
import { initResponseAction } from "@/utils/response/init-response-action";
import { getActionError } from "@/utils/errors/get-action-error";
import { logsGetAllRepository } from "../repository/logs.get-all.repository";

export async function logsGetAllUseCase(page: number, pageSize: number) {
  const resp = initResponseAction();
  try {
    const { data, total } = await logsGetAllRepository(page, pageSize);
    resp.success = true;
    resp.data = data;
    resp.pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
}
