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
        errorResponse(language).errorTitle.INVALID_EMAIL,
        errorResponse(language).errorMessage.INVALID_EMAIL
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
        action: AuditAction.SIGN_UP,
      },
    });

    await request.server.prisma.session.create({
      data: {
        userId: user.id,
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

    await request.server.prisma.session.upsert({
      where: {
        userId: user.id,
      },
      update: {
        userId: user.id,
      },
      create: {
        userId: user.id,
      },
    });

    await request.server.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: AuditAction.SIGN_IN,
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

const signOut = async (
  request: FastifyRequest<{
    Body: {
      userId: string;
    };
  }>,
  reply: FastifyReply
) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const { userId }: any = request.body;

  try {
    const existingSession = await request.server.prisma.session.findUnique({
      where: { userId: userId },
    });

    if (!existingSession) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.NOT_FOUND,
        errorResponse(language).errorTitle.NOT_FOUND,
        errorResponse(language).errorMessage.NOT_FOUND
      );
    }

    await request.server.prisma.auditLog.create({
      data: {
        userId: userId,
        action: AuditAction.SIGN_OUT,
      },
    });

    await request.server.prisma.session.delete({
      where: { userId: userId },
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
  const { renewToken }: any = request.body;

  try {
    if (!renewToken) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.BAD_REQUEST,
        errorResponse(language).errorTitle.LACK_OF_CREDENTIALS,
        errorResponse(language).errorMessage.LACK_OF_CREDENTIALS
      );
    }

    if (!jwtSecretRenewToken) {
      console.error(
        "JWT secret renew token is not configured properly in the environment variables."
      );
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorTitle.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorMessage.INTERNAL_SERVER_ERROR
      );
    }

    let decodedResult: jwt.JwtPayload;
    try {
      decodedResult = jwt.verify(
        renewToken,
        jwtSecretRenewToken
      ) as jwt.JwtPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new HttpErrorResponse(
          ErrorHttpStatusCode.UNAUTHORIZED,
          errorResponse(language).errorTitle.RENEW_TOKEN_EXPIRED,
          errorResponse(language).errorMessage.EXPIRED_TOKEN,
          { expiredRenewToken: true }
        );
      }
      throw err;
    }

    const userId = decodedResult.userId;
    const userRole = decodedResult.userRole;

    if (!jwtSecretToken) {
      console.error(
        "JWT secret tokens are not configured properly in the environment variables."
      );
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorTitle.INTERNAL_SERVER_ERROR,
        errorResponse(language).errorMessage.INTERNAL_SERVER_ERROR
      );
    }

    const tokenPayload = { userId: userId, userRole: userRole };
    const finalAccessToken = jwt.sign(tokenPayload, jwtSecretToken, {
      expiresIn: getJwtExpiryTime(accessTokenLifeSpan),
    });

    return reply.status(SuccessHttpStatusCode.OK).send({
      auth: { accessToken: finalAccessToken },
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
