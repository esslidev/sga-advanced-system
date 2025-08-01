import { FastifyRequest, FastifyReply } from "fastify";
import * as jwt from "jsonwebtoken";
import { HttpError } from "../core/resources/response/httpError";
import { handleError } from "../core/utils/errorHandler";
import {
  getJwtExpiryTime,
  isPasswordValid,
  saltAndHashData,
  verifyHashedData,
  isCINValid
} from "../core/utils/utils";
import { HttpStatusCode } from "../core/enums/response/httpStatusCode";
import { errorResponse } from "../core/resources/response/localizedErrorResponse";

import { ResponseLanguage } from "../core/enums/response/responseLanguage";

const jwtSecretToken = process.env.JWT_SECRET_ACCESS!;
const jwtSecretRenewToken = process.env.JWT_SECRET_RENEW!;
const accessTokenLifeSpan = process.env.ACCESS_TOKEN_LIFESPAN!;
const renewTokenLifeSpan = process.env.RENEW_TOKEN_LIFESPAN!;

export const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
  const {
    CIN,
    password,
    firstName,
    lastName,
  }: any = request.body;

  try {
    if (!CIN || !isCINValid(CIN)) {
      throw new HttpError(
        HttpStatusCode.BAD_REQUEST,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.INVALID_EMAIL,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.INVALID_EMAIL
      );
    }

    if (!password || !isPasswordValid(password)) {
      throw new HttpError(
        HttpStatusCode.BAD_REQUEST,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.INVALID_PASSWORD,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.INVALID_PASSWORD
      );
    }

    if (
      !CIN ||
      !password ||
      !firstName ||
      !lastName
    ) {
      throw new HttpError(
        HttpStatusCode.BAD_REQUEST,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.MISSING_PARAMETERS,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.MISSING_PARAMETERS
      );
    }


    const hashPassword: any = await saltAndHashData(password);


    const existingUser = await request.server.prisma.user.findUnique({
      where: { CIN },
    });

    if (existingUser) {
      throw new HttpError(
        HttpStatusCode.BAD_REQUEST,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.USER_ALREADY_EXISTS,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.USER_ALREADY_EXISTS
      );
    }

    const user = await request.server.prisma.user.create({
      data: {
        CIN,
        hashPassword,
        firstName,
        lastName,
        imageUrl: "",
      },
    });

    const tokenPayload = {
      userId: user.id,
      credential: user.credential,
    };

    const accessToken = jwt.sign(tokenPayload, jwtSecretToken, {
      expiresIn: getJwtExpiryTime(accessTokenLifeSpan),
    });

    const renewToken = jwt.sign(tokenPayload, jwtSecretRenewToken, {
      expiresIn: getJwtExpiryTime(renewTokenLifeSpan),
    });

    await request.server.prisma.session.create({
      data: {
        userId: user.id,
      },
    });


    return reply.status(HttpStatusCode.OK).send({
      data: { accessToken, renewToken },
      status: "Success",
    });
  } catch (error) {
    return handleError(error, reply, ResponseLanguage.ARABIC);
  }
};

export const signIn = async (request: FastifyRequest, reply: FastifyReply) => {
  const { CIN, password }: any = request.body;

  try {
    if (!CIN || !isCINValid(CIN)) {
      throw new HttpError(
        HttpStatusCode.BAD_REQUEST,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.INVALID_EMAIL,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.INVALID_EMAIL
      );
    }

    if (!password || !isPasswordValid(password)) {
      throw new HttpError(
        HttpStatusCode.BAD_REQUEST,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.INVALID_PASSWORD,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.INVALID_PASSWORD
      );
    }

    const user: any = await request.server.prisma.user.findUnique({
      where: { CIN },
    });
    if (!user || !(await verifyHashedData(password, user.hashPassword))) {
      throw new HttpError(
        HttpStatusCode.UNAUTHORIZED,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.INVALID_CREDENTIALS,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.INVALID_CREDENTIALS,
        { accessUnauthorized: true }
      );
    }

    const tokenPayload = {
      userId: user.id,
      rule: user.credential,
    };

    const accessToken = jwt.sign(tokenPayload, jwtSecretToken, {
      expiresIn: getJwtExpiryTime(accessTokenLifeSpan),
    });

    const renewToken = jwt.sign(tokenPayload, jwtSecretRenewToken, {
      expiresIn: getJwtExpiryTime(renewTokenLifeSpan),
    });

    await request.server.prisma.session.upsert({
      where: {
        userId: user.id
      },
      update: {
        userId: user.id
      },
      create: {
        userId: user.id,
      },
    });

    return reply.status(HttpStatusCode.OK).send({
      data: { accessToken, renewToken },
      status: "Success",
    });
  } catch (error) {
    return handleError(error, reply, ResponseLanguage.ARABIC);
  }
};

export const signOut = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId }: any = request.body;

  try {
    const existingSession = await request.server.prisma.session.findUnique({
      where: { userId: userId },
    });

    if (!existingSession) {
      throw new HttpError(
        HttpStatusCode.NOT_FOUND,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.NOT_FOUND,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.NOT_FOUND
      );
    }

    await request.server.prisma.session.delete({
      where: { userId: userId },
    });

    return reply.status(HttpStatusCode.OK).send({
      message: "User is signed out successfully.",
      status: "Success",
    });
  } catch (error) {
    return handleError(error, reply, ResponseLanguage.ARABIC);
  }
};

export const renewAccess = async (request: FastifyRequest, reply: FastifyReply) => {
  const { renewToken }: any = request.body;

  try {
    if (!renewToken) {
      throw new HttpError(
        HttpStatusCode.BAD_REQUEST,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.LACK_OF_CREDENTIALS,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.LACK_OF_CREDENTIALS
      );
    }

    if (!jwtSecretRenewToken) {
      console.error("JWT secret renew token is not configured properly in the environment variables.");
      throw new HttpError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.INTERNAL_SERVER_ERROR,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.INTERNAL_SERVER_ERROR
      );
    }

    let decodedResult: jwt.JwtPayload;
    try {
      decodedResult = jwt.verify(renewToken, jwtSecretRenewToken) as jwt.JwtPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new HttpError(
          HttpStatusCode.UNAUTHORIZED,
          errorResponse(ResponseLanguage.ARABIC).errorTitle.RENEW_TOKEN_EXPIRED,
          errorResponse(ResponseLanguage.ARABIC).errorMessage.EXPIRED_TOKEN,
          { expiredRenewToken: true }
        );
      }
      throw err;
    }

    const userId = decodedResult.userId;
    const userRole = decodedResult.userRole;

    if (!jwtSecretToken) {
      console.error("JWT secret tokens are not configured properly in the environment variables.");
      throw new HttpError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.INTERNAL_SERVER_ERROR,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.INTERNAL_SERVER_ERROR
      );
    }

    const tokenPayload = { userId: userId, userRole: userRole };
    const finalAccessToken = jwt.sign(tokenPayload, jwtSecretToken, {
      expiresIn: getJwtExpiryTime(accessTokenLifeSpan),
    });

    return reply.status(HttpStatusCode.OK).send({
      data: { accessToken: finalAccessToken },
      status: "Success",
    });
  } catch (error) {
    return handleError(error, reply, ResponseLanguage.ARABIC);
  }
};

