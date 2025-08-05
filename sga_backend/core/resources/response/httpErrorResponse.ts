import {
  ArErrorMessage,
  ArErrorTitle,
} from "../../enums/responses/arabic/errorResponses";

import {
  FrErrorMessage,
  FrErrorTitle,
} from "../../enums/responses/french/errorResponses";

import { ErrorHttpStatusCode } from "../../enums/responses/responseStatusCode";

// Error-only status codes
type HttpErrorStatusCode = ErrorHttpStatusCode;

// Error-only titles and messages
type ErrorResponseTitle = ArErrorTitle | FrErrorTitle;
type ErrorResponseMessage = ArErrorMessage | FrErrorMessage;

export class HttpErrorResponse {
  public statusCode: HttpErrorStatusCode;
  public responseTitle: ErrorResponseTitle;
  public responseMessage: ErrorResponseMessage;
  public expiredAccessToken: boolean;
  public expiredRenewToken: boolean;
  public accessUnauthorized: boolean;

  constructor(
    statusCode: HttpErrorStatusCode,
    responseTitle: ErrorResponseTitle,
    responseMessage: ErrorResponseMessage,
    {
      expiredAccessToken = false,
      expiredRenewToken = false,
      accessUnauthorized = false,
    } = {}
  ) {
    this.statusCode = statusCode;
    this.responseTitle = responseTitle;
    this.responseMessage = responseMessage;
    this.expiredAccessToken = expiredAccessToken;
    this.expiredRenewToken = expiredRenewToken;
    this.accessUnauthorized = accessUnauthorized;
  }
}
