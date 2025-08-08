import {
  signInThunk,
  signUpThunk,
  signOutThunk,
} from "../redux/thunks/authThunks";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const useAuth = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const apiAuth = useAppSelector((state) => state.auth.apiAuth);
  const loading = useAppSelector((state) => state.auth.loading);
  const response = useAppSelector((state) => state.auth.response);

  // Thunk actions
  const signIn = (payload: { CIN: string; password: string }) =>
    dispatch(signInThunk(payload));

  const signUp = (payload: {
    adminAccessCode: string;
    CIN: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => dispatch(signUpThunk(payload));

  const signOut = () => dispatch(signOutThunk());

  return {
    apiAuth,
    loading,
    response,
    signIn,
    signUp,
    signOut,
  };
};
