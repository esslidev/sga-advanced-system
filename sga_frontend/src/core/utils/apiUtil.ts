import type { ApiResponse } from "../../features/models/apiResponse";
import type { AppDispatch, RootState } from "../../features/redux/store";
import { renewAccessThunk } from "../../features/redux/thunks/authThunks";

type RequestFn<T> = (accessToken: string) => Promise<T>;

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

export async function authRequestHandler<T>(
  requestFn: RequestFn<T>,
  dispatch: AppDispatch,
  getState: () => RootState
): Promise<T | ApiResponse> {
  let accessToken = getState().auth.apiAuth?.accessToken;

  if (!accessToken) {
    return {
      statusCode: 401,
      title: "غير مصرح",
      message: "رمز الوصول مفقود. يرجى تسجيل الدخول مرة أخرى.",
      expiredAccessToken: false,
      expiredRenewToken: false,
      accessUnauthorized: true,
    };
  }

  try {
    return await requestFn(accessToken);
  } catch (error: any) {
    const errorResponse: ApiResponse | undefined =
      error?.response?.data?.response;

    if (errorResponse?.expiredAccessToken) {
      const renewToken = getState().auth.apiAuth?.renewToken;
      if (!renewToken) {
        return {
          statusCode: 401,
          title: "غير مصرح",
          message: "رمز التجديد مفقود. يرجى تسجيل الدخول مرة أخرى.",
          expiredAccessToken: false,
          expiredRenewToken: false,
          accessUnauthorized: true,
        };
      }

      const renewResult = await dispatch(renewAccessThunk({ renewToken }));

      if (renewAccessThunk.fulfilled.match(renewResult)) {
        accessToken = renewResult.payload.newAccessToken;
        try {
          if (!accessToken) {
            return {
              statusCode: 401,
              title: "غير مصرح",
              message: "رمز الوصول مفقود. يرجى تسجيل الدخول مرة أخرى.",
              expiredAccessToken: false,
              expiredRenewToken: false,
              accessUnauthorized: true,
            };
          }
          return await requestFn(accessToken);
        } catch (retryError: any) {
          const retryErrorResponse: ApiResponse | undefined =
            retryError?.response?.data?.response;

          return retryErrorResponse || createUnauthorizedResponse();
        }
      } else {
        return {
          statusCode: 401,
          title: "انتهت الجلسة",
          message: "فشل تجديد الرمز. يرجى تسجيل الدخول مرة أخرى.",
          expiredAccessToken: false,
          expiredRenewToken: true,
          accessUnauthorized: true,
        };
      }
    }

    // Return errorResponse if exists or fallback generic
    if (errorResponse) return errorResponse;

    return createUnauthorizedResponse();
  }
}
