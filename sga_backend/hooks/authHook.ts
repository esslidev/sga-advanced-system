import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";
import { HttpError } from "../core/resources/response/httpError";
import * as jwt from "jsonwebtoken";
import { handleError } from "../core/utils/errorHandler";
import { HttpStatusCode } from "../core/enums/response/httpStatusCode";
import { errorResponse } from "../core/resources/response/localizedErrorResponse";

const envApiKey = process.env.API_SECRET_KEY;
const jwtSecretToken = process.env.JWT_SECRET_ACCESS;

export async function integrationAuthHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const apiKey = request.headers["apikey"];
  const language = request.headers["language"] as string;

  try {
    if (!apiKey) {
      throw new HttpError(
        HttpStatusCode.UNAUTHORIZED,
        errorResponse(language).errorTitle.LACK_OF_CREDENTIALS,
        errorResponse(language).errorMessage.LACK_OF_CREDENTIALS
      );
    }

    if (apiKey !== envApiKey) {
      throw new HttpError(
        HttpStatusCode.UNAUTHORIZED,
        errorResponse(language).errorTitle.INVALID_CREDENTIALS,
        errorResponse(language).errorMessage.INVALID_CREDENTIALS
      );
    }

    request.body = {
      ...(request.body || {}),
      language,
      userId: null,
      isAdmin: null,
    };
  } catch (error) {
    return handleError(error, reply, language);
  }
}

export async function authHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const language = request.headers["language"] as string;
  const accessToken = request.headers["authorization"];

  try {
    if (!accessToken) {
      throw new HttpError(
        HttpStatusCode.UNAUTHORIZED,
        errorResponse(language).errorTitle.AUTHENTICATION_ERROR,
        errorResponse(language).errorMessage.LACK_OF_CREDENTIALS,
        { accessUnauthorized: true }
      );
    }

    if (!jwtSecretToken) {
      throw new HttpError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
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
        throw new HttpError(
          HttpStatusCode.UNAUTHORIZED,
          errorResponse(language).errorTitle.ACCESS_TOKEN_EXPIRED,
          errorResponse(language).errorMessage.EXPIRED_TOKEN,
          { expiredAccessToken: true }
        );
      }
      throw err;
    }

    request.body = {
      ...(request.body || {}),
      language,
      userId: decoded.userId,
      isAdmin: decoded.isAdmin,
    };
  } catch (error) {
    return handleError(error, reply, language);
  }
}

export async function isAdminHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const language = request.headers["language"] as string;
  const userId = (request.body as any).userId;

  try {
    const user = await request.server.prisma.user.findUnique({
      where: {
        id: userId,
        credential: "standard",
        deletedAt: null,
      },
    });

    if (!user) {
      throw new HttpError(
        HttpStatusCode.FORBIDDEN,
        errorResponse(language).errorTitle.UNAUTHORIZED_ACCESS,
        errorResponse(language).errorMessage.UNAUTHORIZED_ACCESS,
        { accessUnauthorized: true }
      );
    }
  } catch (error) {
    return handleError(error, reply, language);
  }
}

export async function isVerifiedHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const language = request.headers["language"] as string;
  const userId = (request.body as any).userId;

  try {
    const user = await request.server.prisma.user.findUnique({
      where: { id: userId,  deletedAt: null },
    });

    if (!user) {
      throw new HttpError(
        HttpStatusCode.FORBIDDEN,
        errorResponse(language).errorTitle.EMAIL_NOT_VERIFIED,
        errorResponse(language).errorMessage.EMAIL_NOT_VERIFIED
      );
    }
  } catch (error) {
    return handleError(error, reply, language);
  }
}
