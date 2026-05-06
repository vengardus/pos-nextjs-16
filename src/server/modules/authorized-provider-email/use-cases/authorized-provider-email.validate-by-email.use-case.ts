import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import {
  AuthorizedProviderEmailBaseSchema,
  type AuthorizedProviderEmailValidationStatus,
} from "@/server/modules/authorized-provider-email/domain/authorized-provider-email.base.schema";
import { authorizedProviderEmailGetByEmailRepository } from "@/server/modules/authorized-provider-email/repository/authorized-provider-email.get-by-email.repository";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const isExpiredAuthorizedProviderEmail = (expirationDate: string): boolean => {
  const [year, month, day] = expirationDate.split(/[-/]/).map(Number);

  if (!year || !month || !day) {
    throw new Error("La fecha de expiración configurada no es válida.");
  }

  const expirationUtc = Date.UTC(year, month - 1, day, 23, 59, 59, 999);
  return Date.now() > expirationUtc;
};

export interface AuthorizedProviderEmailValidationResult {
  status: AuthorizedProviderEmailValidationStatus;
  record: ReturnType<typeof AuthorizedProviderEmailBaseSchema.parse> | null;
}

export const authorizedProviderEmailValidateByEmailUseCase = async (
  email: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      throw new Error("El email es obligatorio.");
    }

    const record = await authorizedProviderEmailGetByEmailRepository(
      normalizedEmail
    );

    if (!record) {
      resp.success = true;
      resp.data = {
        status: "NOT_FOUND",
        record: null,
      } satisfies AuthorizedProviderEmailValidationResult;
      return resp;
    }

    const parsedRecord = AuthorizedProviderEmailBaseSchema.parse(record);

    if (!parsedRecord.isActive) {
      resp.success = true;
      resp.data = {
        status: "INACTIVE",
        record: parsedRecord,
      } satisfies AuthorizedProviderEmailValidationResult;
      return resp;
    }

    if (isExpiredAuthorizedProviderEmail(parsedRecord.expirationDate)) {
      resp.success = true;
      resp.data = {
        status: "EXPIRED",
        record: parsedRecord,
      } satisfies AuthorizedProviderEmailValidationResult;
      return resp;
    }

    resp.success = true;
    resp.data = {
      status: "AUTHORIZED",
      record: parsedRecord,
    } satisfies AuthorizedProviderEmailValidationResult;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
