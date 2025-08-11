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
    "ar" // Defaulting to Arabic if no language header
  )!;
  const accessToken = request.headers["authorization"];

  try {
    // Check if access token is present
    if (!accessToken) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.UNAUTHORIZED,
        errorResponse(language).errorTitle.AUTHENTICATION_ERROR,
        errorResponse(language).errorMessage.LACK_OF_CREDENTIALS,
        { accessUnauthorized: true }
      );
    }

    // Check if jwtSecretToken is available
    if (!jwtSecretToken) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorTitle.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorMessage.INTERNAL_SERVER_ERROR,
        { accessUnauthorized: true }
      );
    }

    // Decode the JWT token
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

      if (err instanceof jwt.JsonWebTokenError) {
        throw new HttpErrorResponse(
          ErrorHttpStatusCode.UNAUTHORIZED,
          errorResponse(language).errorTitle.AUTHENTICATION_ERROR,
          errorResponse(language).errorMessage.INVALID_TOKEN,
          { accessUnauthorized: true }
        );
      }

      // For any other unexpected JWT error
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorTitle.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorMessage.INTERNAL_SERVER_ERROR,
        { accessUnauthorized: true }
      );
    }

    // Check if the user exists in the session table (using Prisma)
    const existingSession = await request.server.prisma.session.findUnique({
      where: {
        userId: decoded.userId,
        accessKeyPartial: accessToken.slice(-8),
      },
    });

    // If no session found, throw error
    if (!existingSession) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.UNAUTHORIZED,
        errorResponse(language).errorTitle.SESSION_EXPIRED,
        errorResponse(language).errorMessage.SESSION_NOT_FOUND,
        { sessionExpired: true }
      );
    }

    // If the session is valid, attach user info to request
    request.user = {
      userId: decoded.userId,
    };
  } catch (error) {
    // Handle error (e.g. expired access token, missing session, etc.)
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
