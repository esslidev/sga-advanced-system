import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";
import { HttpError } from "../core/resources/response/httpError";
import * as jwt from "jsonwebtoken";
import { handleError } from "../core/utils/errorHandler";
import { HttpStatusCode } from "../core/enums/response/httpStatusCode";
import { errorResponse } from "../core/resources/response/localizedErrorResponse";
import { UserCredential } from "@prisma/client";
import { ResponseLanguage } from "../core/enums/response/responseLanguage";

const envApiKey = process.env.API_SECRET_KEY;
const jwtSecretToken = process.env.JWT_SECRET_ACCESS;

export async function integrationAuthHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const apiKey = request.headers["apikey"];

  try {
    if (!apiKey) {
      throw new HttpError(
        HttpStatusCode.UNAUTHORIZED,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.LACK_OF_CREDENTIALS,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.LACK_OF_CREDENTIALS
      );
    }

    if (apiKey !== envApiKey) {
      throw new HttpError(
        HttpStatusCode.UNAUTHORIZED,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.INVALID_CREDENTIALS,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.INVALID_CREDENTIALS
      );
    }
  } catch (error) {
    return handleError(error, reply, ResponseLanguage.ARABIC);
  }
}

export async function authHook(request: FastifyRequest, reply: FastifyReply) {
  const accessToken = request.headers["authorization"];

  try {
    if (!accessToken) {
      throw new HttpError(
        HttpStatusCode.UNAUTHORIZED,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.AUTHENTICATION_ERROR,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.LACK_OF_CREDENTIALS,
        { accessUnauthorized: true }
      );
    }

    if (!jwtSecretToken) {
      throw new HttpError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.INTERNAL_SERVER_ERROR,
        errorResponse(
          ResponseLanguage.ARABIC
        ).errorMessage.INTERNAL_SERVER_ERROR,
        { accessUnauthorized: true }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(accessToken, jwtSecretToken);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new HttpError(
          HttpStatusCode.UNAUTHORIZED,
          errorResponse(
            ResponseLanguage.ARABIC
          ).errorTitle.ACCESS_TOKEN_EXPIRED,
          errorResponse(ResponseLanguage.ARABIC).errorMessage.EXPIRED_TOKEN,
          { expiredAccessToken: true }
        );
      }
      throw err;
    }

    request.body = {
      ...(request.body || {}),
      userId: decoded.userId,
      isAdmin: decoded.isAdmin,
    };
  } catch (error) {
    return handleError(error, reply, ResponseLanguage.ARABIC);
  }
}

export async function isAdminHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = (request.body as any).userId;

  try {
    const user = await request.server.prisma.user.findUnique({
      where: {
        id: userId,
        credential: UserCredential.admin,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new HttpError(
        HttpStatusCode.FORBIDDEN,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.UNAUTHORIZED_ACCESS,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.UNAUTHORIZED_ACCESS,
        { accessUnauthorized: true }
      );
    }
  } catch (error) {
    return handleError(error, reply, ResponseLanguage.ARABIC);
  }
}
