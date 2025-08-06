import { FastifyRequest, FastifyReply } from "fastify";
import * as jwt from "jsonwebtoken";
import { handleError } from "../core/utils/errorHandler";
import { errorResponse } from "../core/resources/response/localizedResponse";
import { HttpErrorResponse } from "../core/resources/response/httpErrorResponse";
import { ErrorHttpStatusCode } from "../core/enums/responses/responseStatusCode";
import { ResponseLanguage } from "../core/enums/responses/responseLanguage";
import { getHeaderValue } from "../core/utils/headerValueGetter";
import { UserRole } from "@prisma/client";

const envApiKey = process.env.API_SECRET_KEY;
const jwtSecretToken = process.env.JWT_SECRET_ACCESS;

export async function integrationAuthHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const apiKey = request.headers["apikey"];

  try {
    if (!apiKey) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.UNAUTHORIZED,
        errorResponse(language).errorTitle.LACK_OF_CREDENTIALS,
        errorResponse(language).errorMessage.LACK_OF_CREDENTIALS
      );
    }

    if (apiKey !== envApiKey) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.UNAUTHORIZED,
        errorResponse(language).errorTitle.INVALID_CREDENTIALS,
        errorResponse(language).errorMessage.INVALID_CREDENTIALS
      );
    }
  } catch (error) {
    return handleError(error, reply, ResponseLanguage.ARABIC);
  }
}

export async function authHook(request: FastifyRequest, reply: FastifyReply) {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const accessToken = request.headers["authorization"];

  try {
    if (!accessToken) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.UNAUTHORIZED,
        errorResponse(language).errorTitle.AUTHENTICATION_ERROR,
        errorResponse(language).errorMessage.LACK_OF_CREDENTIALS,
        { accessUnauthorized: true }
      );
    }

    if (!jwtSecretToken) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorTitle.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorMessage.INTERNAL_SERVER_ERROR,
        { accessUnauthorized: true }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(accessToken, jwtSecretToken);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new HttpErrorResponse(
          ErrorHttpStatusCode.UNAUTHORIZED,
          errorResponse(language).errorTitle.ACCESS_TOKEN_EXPIRED,
          errorResponse(language).errorMessage.EXPIRED_TOKEN,
          { expiredAccessToken: true }
        );
      }
      throw err;
    }

    request.user = {
      userId: decoded.userId,
      userRole: decoded.userRole,
    };
  } catch (error) {
    return handleError(error, reply, language);
  }
}

export async function isAdminHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const { userId } = request.user;

  try {
    const user = await request.server.prisma.user.findUnique({
      where: {
        id: userId,
        role: UserRole.admin,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.FORBIDDEN,
        errorResponse(language).errorTitle.UNAUTHORIZED_ACCESS,
        errorResponse(language).errorMessage.UNAUTHORIZED_ACCESS,
        { accessUnauthorized: true }
      );
    }
  } catch (error) {
    return handleError(error, reply, language);
  }
}
