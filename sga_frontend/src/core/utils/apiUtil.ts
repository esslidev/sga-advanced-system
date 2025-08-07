import { logoutLocal } from "../../features/redux/slices/authSlice";
import type { AppDispatch, RootState } from "../../features/redux/store";
import { renewAccessThunk } from "../../features/redux/thunks/authThunks";

type RequestFn<T> = (accessToken: string) => Promise<T>;

export async function authRequestHandler<T>(
  requestFn: RequestFn<T>,
  dispatch: AppDispatch,
  getState: () => RootState
): Promise<T> {
  let accessToken = getState().auth.accessToken;

  if (!accessToken) {
    dispatch(logoutLocal());
    console.log("Access token missing. Please login again.");
    throw new Error("Access token missing. Please login again.");
  }

  try {
    return await requestFn(accessToken);
  } catch (error: any) {
    const errorData = error?.response?.data?.response;

    if (errorData?.expiredRenewToken === true) {
      // Renew token expired → session expired → logout
      dispatch(logoutLocal());
      console.log("Session expired. Please login again.");
      throw new Error("Session expired. Please login again.");
    }

    if (errorData?.expiredAccessToken === true) {
      // Access token expired → try renewing the token
      const renewToken = getState().auth.renewToken;

      if (!renewToken) {
        dispatch(logoutLocal());
        console.log("Renew token missing. Please login again.");
        throw new Error("Renew token missing. Please login again.");
      }

      const renewResult = await dispatch(renewAccessThunk(renewToken));

      if (renewAccessThunk.fulfilled.match(renewResult)) {
        accessToken = renewResult.payload.accessToken;
        return await requestFn(accessToken);
      } else {
        dispatch(logoutLocal());
        console.log("Session expired. Please login again.");
        throw new Error("Session expired. Please login again.");
      }
    }

    throw error;
  }
}
