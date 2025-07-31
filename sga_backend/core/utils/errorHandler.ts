import { FastifyReply } from "fastify";
import { HttpError } from "../resources/response/httpError";
import { ResponseLanguage } from "../enums/response/responseLanguage";
import { HttpStatusCode } from "../enums/response/httpStatusCode";
import { errorResponse } from "../resources/response/localizedErrorResponse";

const handleError = (
  error: any,
  reply: FastifyReply,
  language: string = ResponseLanguage.ENGLISH
) => {
  const errorLang = errorResponse(language);

  if (error instanceof HttpError) {
    return reply.code(error.statusCode).send({
      error: error.errorTitle,
      message: error.errorMessage,
      expiredAccessToken: error.expiredAccessToken,
      expiredRenewToken: error.expiredRenewToken,
    });
  } else {
    console.error(error);
    return reply.code(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
      error: errorLang.errorTitle.INTERNAL_SERVER_ERROR,
      message: errorLang.errorMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

export { handleError };
