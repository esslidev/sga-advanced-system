import { FastifyReply } from "fastify";
import { errorResponse } from "../resources/response/localizedResponse";
import { HttpErrorResponse } from "../resources/response/httpErrorResponse";
import { ResponseLanguage } from "../enums/responses/responseLanguage";
import { ErrorHttpStatusCode } from "../enums/responses/responseStatusCode";

const handleError = (
  error: any,
  reply: FastifyReply,
  language: string = ResponseLanguage.ARABIC
) => {
  const errorResponseLang = errorResponse(language);

  if (error instanceof HttpErrorResponse) {
    return reply.code(error.statusCode).send({
      response: {
        statusCode: error.statusCode,
        title: error.responseTitle,
        message: error.responseMessage,
        expiredAccessToken: error.expiredAccessToken,
        expiredRenewToken: error.expiredRenewToken,
      },
    });
  } else {
    console.error(error);
    return reply.code(ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
      response: {
        statusCode: ErrorHttpStatusCode.BAD_REQUEST,
        title: errorResponseLang.errorTitle.INTERNAL_SERVER_ERROR,
        message: errorResponseLang.errorMessage.INTERNAL_SERVER_ERROR,
      },
    });
  }
};

export { handleError };
