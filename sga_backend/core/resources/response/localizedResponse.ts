import {
  ArErrorMessage,
  ArErrorTitle,
} from "../../enums/responses/arabic/errorResponses";
import {
  ArSuccessMessage,
  ArSuccessTitle,
} from "../../enums/responses/arabic/successResponses";
import {
  FrErrorMessage,
  FrErrorTitle,
} from "../../enums/responses/french/errorResponses";
import {
  FrSuccessMessage,
  FrSuccessTitle,
} from "../../enums/responses/french/successResponses";
import { ResponseLanguage } from "../../enums/responses/responseLanguage";

interface ErrorResponse {
  errorTitle: typeof ArErrorTitle | typeof FrErrorTitle;
  errorMessage: typeof ArErrorMessage | typeof FrErrorMessage;
}

interface SuccessResponse {
  successTitle: typeof ArSuccessTitle | typeof FrSuccessTitle;
  successMessage: typeof ArSuccessMessage | typeof FrSuccessMessage;
}

export const errorResponse = (
  language: string = ResponseLanguage.ARABIC
): ErrorResponse => {
  switch (language) {
    case ResponseLanguage.FRENCH:
      return {
        errorTitle: FrErrorTitle,
        errorMessage: FrErrorMessage,
      };
    case ResponseLanguage.ARABIC:
      return {
        errorTitle: ArErrorTitle,
        errorMessage: ArErrorMessage,
      };
    default:
      return {
        errorTitle: ArErrorTitle,
        errorMessage: ArErrorMessage,
      };
  }
};

export const successResponse = (
  language: string = ResponseLanguage.ARABIC
): SuccessResponse => {
  switch (language) {
    case ResponseLanguage.FRENCH:
      return {
        successTitle: FrSuccessTitle,
        successMessage: FrSuccessMessage,
      };
    case ResponseLanguage.ARABIC:
      return {
        successTitle: ArSuccessTitle,
        successMessage: ArSuccessMessage,
      };
    default:
      return {
        successTitle: ArSuccessTitle,
        successMessage: ArSuccessMessage,
      };
  }
};
