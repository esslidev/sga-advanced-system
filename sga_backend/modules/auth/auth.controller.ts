import { FastifyRequest, FastifyReply } from "fastify";
import * as jwt from "jsonwebtoken";
import { handleError } from "../../core/utils/errorHandler";
import {
  getJwtExpiryTime,
  isPasswordValid,
  saltAndHashData,
  verifyHashedData,
  isCINValid,
} from "../../core/utils/utils";
import {
  errorResponse,
  successResponse,
} from "../../core/resources/response/localizedResponse";
import { HttpErrorResponse } from "../../core/resources/response/httpErrorResponse";
import {
  ErrorHttpStatusCode,
  SuccessHttpStatusCode,
} from "../../core/enums/responses/responseStatusCode";
import { ResponseLanguage } from "../../core/enums/responses/responseLanguage";
import { getHeaderValue } from "../../core/utils/headerValueGetter";
import { AuditAction } from "@prisma/client";

const adminHashedAccessCode = process.env.ADMIN_HASHED_ACCESS_CODE!;
const jwtSecretToken = process.env.JWT_SECRET_ACCESS!;
const jwtSecretRenewToken = process.env.JWT_SECRET_RENEW!;
const accessTokenLifeSpan = process.env.ACCESS_TOKEN_LIFESPAN!;
const renewTokenLifeSpan = process.env.RENEW_TOKEN_LIFESPAN!;

const signUp = async (
  request: FastifyRequest<{
    Body: {
      adminAccessCode: string;
      CIN: string;
      password: string;
      firstName: string;
      lastName: string;
    };
  }>,
  reply: FastifyReply
) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;

  const { adminAccessCode, CIN, password, firstName, lastName } = request.body;

  try {
    if (!adminAccessCode) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.UNAUTHORIZED,
        errorResponse(language).errorTitle.MISSING_ADMIN_ACCESS_CODE,
        errorResponse(language).errorMessage.MISSING_ADMIN_ACCESS_CODE
      );
    }

    const isCodeValid = await verifyHashedData(
      adminAccessCode,
      adminHashedAccessCode
    );

    if (!isCodeValid) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.UNAUTHORIZED,
        errorResponse(language).errorTitle.INVALID_ADMIN_ACCESS_CODE,
        errorResponse(language).errorMessage.INVALID_ADMIN_ACCESS_CODE
      );
    }

    if (!CIN || !isCINValid(CIN)) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.BAD_REQUEST,
        errorResponse(language).errorTitle.INVALID_CIN,
        errorResponse(language).errorMessage.INVALID_CIN
      );
    }

    if (!password || !isPasswordValid(password)) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.BAD_REQUEST,
        errorResponse(language).errorTitle.INVALID_PASSWORD,
        errorResponse(language).errorMessage.INVALID_PASSWORD
      );
    }

    if (!firstName || !lastName) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.BAD_REQUEST,
        errorResponse(language).errorTitle.MISSING_PARAMETERS,
        errorResponse(language).errorMessage.MISSING_PARAMETERS
      );
    }

    const hashedPassword = await saltAndHashData(password);

    const existingUser = await request.server.prisma.user.findUnique({
      where: { CIN },
    });

    if (existingUser) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.BAD_REQUEST,
        errorResponse(language).errorTitle.USER_ALREADY_EXISTS,
        errorResponse(language).errorMessage.USER_ALREADY_EXISTS
      );
    }

    const user = await request.server.prisma.user.create({
      data: {
        CIN,
        hashedPassword,
        firstName,
        lastName,
        imageUrl: "",
      },
    });

    const tokenPayload = {
      userId: user.id,
      userRole: user.role,
    };

    const accessToken = jwt.sign(tokenPayload, jwtSecretToken, {
      expiresIn: getJwtExpiryTime(accessTokenLifeSpan),
    });

    const renewToken = jwt.sign(tokenPayload, jwtSecretRenewToken, {
      expiresIn: getJwtExpiryTime(renewTokenLifeSpan),
    });

    await request.server.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: AuditAction.signUp,
      },
    });

    await request.server.prisma.session.create({
      data: {
        userId: user.id,
        accessKeyPartial: accessToken.slice(-8),
      },
    });

    return reply.status(SuccessHttpStatusCode.OK).send({
      auth: { accessToken, renewToken },
      response: {
        statusCode: SuccessHttpStatusCode.OK,
        title: successResponse(language).successTitle.SIGNED_UP,
        message: successResponse(language).successMessage.SIGNED_UP,
      },
    });
  } catch (error) {
    return handleError(error, reply, language);
  }
};

const signIn = async (
  request: FastifyRequest<{
    Body: {
      CIN: string;
      password: string;
    };
  }>,
  reply: FastifyReply
) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const { CIN, password }: any = request.body;

  try {
    if (!CIN || !isCINValid(CIN)) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.BAD_REQUEST,
        errorResponse(language).errorTitle.INVALID_CIN,
        errorResponse(language).errorMessage.INVALID_CIN
      );
    }

    if (!password || !isPasswordValid(password)) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.BAD_REQUEST,
        errorResponse(language).errorTitle.INVALID_PASSWORD,
        errorResponse(language).errorMessage.INVALID_PASSWORD
      );
    }

    const user: any = await request.server.prisma.user.findUnique({
      where: { CIN },
    });
    if (!user || !(await verifyHashedData(password, user.hashedPassword))) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.UNAUTHORIZED,
        errorResponse(language).errorTitle.INVALID_CREDENTIALS,
        errorResponse(language).errorMessage.INVALID_CREDENTIALS,
        { accessUnauthorized: true }
      );
    }

    // Check if a session already exists
    const existingSession = await request.server.prisma.session.findFirst({
      where: { userId: user.id },
    });

    // If session exists, delete it and stop signing in
    if (existingSession) {
      await request.server.prisma.session.deleteMany({
        where: { userId: user.id },
      });

      // Optionally, you can throw an error indicating session deletion
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.BAD_REQUEST,
        errorResponse(language).errorTitle.SESSION_EXISTS,
        errorResponse(language).errorMessage.SESSION_EXISTS,
        { sessionExpired: true }
      );
    }

    const tokenPayload = {
      userId: user.id,
      userRole: user.role,
    };

    const accessToken = jwt.sign(tokenPayload, jwtSecretToken, {
      expiresIn: getJwtExpiryTime(accessTokenLifeSpan),
    });

    const renewToken = jwt.sign(tokenPayload, jwtSecretRenewToken, {
      expiresIn: getJwtExpiryTime(renewTokenLifeSpan),
    });

    // Create a new session
    await request.server.prisma.session.create({
      data: {
        userId: user.id,
        accessKeyPartial: accessToken.slice(-8),
      },
    });

    // Create an audit log for the sign-in action
    await request.server.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: AuditAction.signIn,
      },
    });

    return reply.status(SuccessHttpStatusCode.OK).send({
      auth: { accessToken, renewToken },
      response: {
        statusCode: SuccessHttpStatusCode.OK,
        title: successResponse(language).successTitle.SIGNED_IN,
        message: successResponse(language).successMessage.SIGNED_IN,
      },
    });
  } catch (error) {
    return handleError(error, reply, language);
  }
};

const signOut = async (request: FastifyRequest, reply: FastifyReply) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;

  const { userId } = request.user;

  try {
    if (!userId) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.BAD_REQUEST,
        errorResponse(language).errorTitle.INVALID_REQUEST,
        errorResponse(language).errorMessage.INVALID_REQUEST
      );
    }

    const existingSession = await request.server.prisma.session.findFirst({
      where: { userId: userId },
    });

    if (!existingSession) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.NOT_FOUND,
        errorResponse(language).errorTitle.NOT_FOUND,
        errorResponse(language).errorMessage.NOT_FOUND
      );
    }

    await request.server.prisma.session.deleteMany({
      where: { userId: userId },
    });

    await request.server.prisma.auditLog.create({
      data: {
        userId: userId,
        action: AuditAction.signOut,
      },
    });

    return reply.status(SuccessHttpStatusCode.OK).send({
      response: {
        statusCode: SuccessHttpStatusCode.OK,
        title: successResponse(language).successTitle.SIGNED_OUT,
        message: successResponse(language).successMessage.SIGNED_OUT,
      },
    });
  } catch (error) {
    return handleError(error, reply, language);
  }
};

const renewAccess = async (
  request: FastifyRequest<{
    Body: {
      expiredAccessToken: string;
      renewToken: string;
    };
  }>,
  reply: FastifyReply
) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const { renewToken, expiredAccessToken }: any = request.body;

  try {
    if (!expiredAccessToken || !renewToken) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.BAD_REQUEST,
        errorResponse(language).errorTitle.LACK_OF_CREDENTIALS,
        errorResponse(language).errorMessage.LACK_OF_CREDENTIALS
      );
    }

    if (!jwtSecretRenewToken) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorTitle.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorMessage.INTERNAL_SERVER_ERROR
      );
    }

    // Decode and verify the renew token
    let decodedResult: jwt.JwtPayload;
    try {
      decodedResult = jwt.verify(
        renewToken,
        jwtSecretRenewToken
      ) as jwt.JwtPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        // Handle expired token
        throw new HttpErrorResponse(
          ErrorHttpStatusCode.UNAUTHORIZED,
          errorResponse(language).errorTitle.RENEW_TOKEN_EXPIRED,
          errorResponse(language).errorMessage.EXPIRED_TOKEN,
          { expiredRenewToken: true }
        );
      }

      if (err instanceof jwt.JsonWebTokenError) {
        // Handle invalid or malformed token
        throw new HttpErrorResponse(
          ErrorHttpStatusCode.UNAUTHORIZED,
          errorResponse(language).errorTitle.INVALID_TOKEN,
          errorResponse(language).errorMessage.INVALID_TOKEN,
          { accessUnauthorized: true }
        );
      }

      // Rethrow any other errors
      throw err;
    }

    const userId = decodedResult.userId;
    const userRole = decodedResult.userRole;

    if (!jwtSecretToken) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorTitle.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorMessage.INTERNAL_SERVER_ERROR
      );
    }

    // Generate the new access token
    const tokenPayload = { userId, userRole };
    const newAccessToken = jwt.sign(tokenPayload, jwtSecretToken, {
      expiresIn: getJwtExpiryTime(accessTokenLifeSpan),
    });

    try {
      await request.server.prisma.session.update({
        where: { accessKeyPartial: expiredAccessToken.slice(-8) },
        data: {
          accessKeyPartial: newAccessToken.slice(-8),
        },
      });
    } catch (error) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorTitle.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorMessage.INTERNAL_SERVER_ERROR,
        { accessUnauthorized: true }
      );
    }

    return reply.status(SuccessHttpStatusCode.OK).send({
      auth: { newAccessToken: newAccessToken },
    });
  } catch (error) {
    return handleError(error, reply, language);
  }
};

export default {
  signUp,
  signIn,
  signOut,
  renewAccess,
};
