import type { ApiResponse } from "../../features/models/apiResponse";
import type { AppDispatch, RootState } from "../../features/redux/store";
import { renewAccessThunk } from "../../features/redux/thunks/authThunks";
import type { AxiosError } from "axios";

// Helper to create an unauthorized response
function createUnauthorizedResponse(
  message = "الولوج غير مصرح به لسبب مجهول, المرجو الاتصال بمصلحة المعلوميات."
): ApiResponse {
  return {
    statusCode: 401,
    title: "غير مصرح",
    message,
    expiredAccessToken: false,
    expiredRenewToken: false,
    accessUnauthorized: true,
  };
}

// Helper to handle missing token cases
function createMissingTokenResponse(type: "access" | "renew"): ApiResponse {
  const message =
    type === "access"
      ? "رمز الوصول مفقود. يرجى تسجيل الدخول مرة أخرى."
      : "رمز التجديد مفقود. يرجى تسجيل الدخول مرة أخرى.";

  return {
    statusCode: 401,
    title: "غير مصرح",
    message,
    expiredAccessToken: type === "access",
    expiredRenewToken: type === "renew",
    accessUnauthorized: true,
  };
}

export async function authRequestHandler<T>(
  requestFn: (accessToken: string) => Promise<T>,
  dispatch: AppDispatch,
  state: RootState
): Promise<T> {
  let accessToken = state.auth.apiAuth?.accessToken;

  if (!accessToken) {
    throw createMissingTokenResponse("access");
  }

  try {
    return await requestFn(accessToken);
  } catch (error) {
    const axiosError = error as AxiosError<{ response?: ApiResponse }>;
    const errorResponse = axiosError?.response?.data?.response;

    if (errorResponse?.expiredAccessToken) {
      const renewToken = state.auth.apiAuth?.renewToken;
      if (!renewToken) throw createMissingTokenResponse("renew");

      const renewResult = await dispatch(
        renewAccessThunk({ expiredAccessToken: accessToken, renewToken })
      );

      if (renewAccessThunk.fulfilled.match(renewResult)) {
        accessToken = renewResult.payload.newAccessToken;

        if (!accessToken) {
          throw createMissingTokenResponse("access");
        }

        try {
          return await requestFn(accessToken);
        } catch (retryError: unknown) {
          const retryAxiosError = retryError as AxiosError<{
            response?: ApiResponse;
          }>;
          const retryErrorResponse = retryAxiosError?.response?.data?.response;

          throw retryErrorResponse || createUnauthorizedResponse();
        }
      } else {
        throw {
          statusCode: 401,
          title: "انتهت الجلسة",
          message: "فشل تجديد الرمز. يرجى تسجيل الدخول مرة أخرى.",
          expiredAccessToken: false,
          expiredRenewToken: true,
          accessUnauthorized: true,
        } as ApiResponse;
      }
    }

    throw errorResponse || createUnauthorizedResponse();
  }
}
