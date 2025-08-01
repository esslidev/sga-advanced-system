import { FastifyRequest, FastifyReply } from "fastify";
import * as jwt from "jsonwebtoken";
import { HttpError } from "../core/resources/response/httpError";
import { handleError } from "../core/utils/errorHandler";
import {
  getJwtExpiryTime,
  isPasswordValid,
  saltAndHashData,
  isCINValid,
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
      !lastName ||
    ) {
      throw new HttpError(
        HttpStatusCode.BAD_REQUEST,
        errorResponse(ResponseLanguage.ARABIC).errorTitle.MISSING_PARAMETERS,
        errorResponse(ResponseLanguage.ARABIC).errorMessage.MISSING_PARAMETERS
      );
    }

   
    const hashedPassword = await saltAndHashData(password);
   

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
        encryptedFirstName,
        encryptedLastName,
        encryptedAddressMain,
        encryptedAddressSecond,
        userPreferences: {
          create: { emailNotifications: true },
        },
      },
    });

    const tokenPayload = {
      userId: user.id,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    };

    const accessToken = jwt.sign(tokenPayload, jwtSecretToken, {
      expiresIn: getJwtExpiryTime(accessTokenLifeSpan),
    });

    const renewToken = jwt.sign(tokenPayload, jwtSecretRenewToken, {
      expiresIn: getJwtExpiryTime(renewTokenLifeSpan),
    });

    await prisma.sessions.create({
      data: {
        userId: user.id,
        accessToken,
        renewToken,
        accessTokenExpiryTime: addSecondsToDate(
          new Date(),
          getJwtExpiryTime(accessTokenLifeSpan)!
        ),
        renewTokenExpiryTime: addSecondsToDate(
          new Date(),
          getJwtExpiryTime(renewTokenLifeSpan)!
        ),
      },
    });

    mailSender(
      email,
      `${storeName} Account Created`,
      undefined,
      accountCreatedTemplatePath,
      {
        username: decryptData(user.encryptedFirstName ?? ""),
        storeName,
        frontendUrl,
      },
      [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "logo",
        },
      ]
    );

    return reply.status(HttpStatusCode.OK).send({
      data: { accessToken, renewToken },
      status: "Success",
    });
  } catch (error) {
    return handleError(error, reply, language);
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

    // const encryptedCIN = encryptData(CIN.toLowerCase());
    // const user = await request.server.prisma.user.findUnique({
    //   where: { encryptedCIN },
    // });
    // if (!user || !(await verifyHashedData(password, user.hashedPassword))) {
    //   throw new HttpError(
    //     HttpStatusCode.UNAUTHORIZED,
    //     errorResponse(ResponseLanguage.ARABIC).errorTitle.INVALID_CREDENTIALS,
    //     errorResponse(ResponseLanguage.ARABIC).errorMessage.INVALID_CREDENTIALS,
    //     { accessUnauthorized: true }
    //   );
    // }
    const cin = CIN;
    const user = await request.server.prisma.user.findUnique({
      where: { CIN: cin },
    });

    if (!user || !(password === user.password)) {
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
        userId: user.id,
      },
      update: {
        userId: user.id,
        createdAt: new Date().toISOString(),
        User: {
          connect: {
            id: user.id,
          },
        },
      },
      create: {
        userId: user.id,
        createdAt: new Date().toISOString(),
        User: {
          connect: {
            id: user.id,
          },
        },
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
  const { language, userId }: any = request.body;

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

    await prisma.sessions.delete({
      where: { userId: Number(userId) },
    });

    return reply.status(HttpStatusCode.OK).send({
      message: "User is signed out successfully.",
      status: "Success",
    });
  } catch (error) {
    return handleError(error, reply, ResponseLanguage.ARABIC);
  }
};
