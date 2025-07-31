import {
  ArErrorTitle,
  ArErrorMessage,
} from "../../enums/response/arErrorResponse";
import {
  DeErrorTitle,
  DeErrorMessage,
} from "../../enums/response/deErrorResponse";
import {
  EnErrorTitle,
  EnErrorMessage,
} from "../../enums/response/enErrorResponse";
import {
  FrErrorTitle,
  FrErrorMessage,
} from "../../enums/response/frErrorResponse";
import { ResponseLanguage } from "../../enums/response/responseLanguage";

interface ErrorResponse {
  errorTitle:
    | typeof EnErrorTitle
    | typeof FrErrorTitle
    | typeof DeErrorTitle
    | typeof ArErrorTitle;
  errorMessage:
    | typeof EnErrorMessage
    | typeof FrErrorMessage
    | typeof DeErrorMessage
    | typeof ArErrorMessage;
}

export const errorResponse = (
  language: string = ResponseLanguage.ENGLISH
): ErrorResponse => {
  switch (language) {
    case ResponseLanguage.ENGLISH:
      return {
        errorTitle: EnErrorTitle,
        errorMessage: EnErrorMessage,
      };
    case ResponseLanguage.FRENCH:
      return {
        errorTitle: FrErrorTitle,
        errorMessage: FrErrorMessage,
      };
    case ResponseLanguage.GERMAN:
      return {
        errorTitle: DeErrorTitle,
        errorMessage: DeErrorMessage,
      };
    case ResponseLanguage.ARABIC:
      return {
        errorTitle: ArErrorTitle,
        errorMessage: ArErrorMessage,
      };
    default:
      return {
        errorTitle: EnErrorTitle,
        errorMessage: EnErrorMessage,
      };
  }
};
