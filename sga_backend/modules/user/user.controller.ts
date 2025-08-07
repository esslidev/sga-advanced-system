import { FastifyRequest, FastifyReply } from "fastify";
import { getHeaderValue } from "../../core/utils/headerValueGetter";
import { ResponseLanguage } from "../../core/enums/responses/responseLanguage";
import { HttpErrorResponse } from "../../core/resources/response/httpErrorResponse";
import {
  errorResponse,
  successResponse,
} from "../../core/resources/response/localizedResponse";
import {
  ErrorHttpStatusCode,
  SuccessHttpStatusCode,
} from "../../core/enums/responses/responseStatusCode";
import { handleError } from "../../core/utils/errorHandler";
import { AuditAction, Prisma, UserRole } from "@prisma/client";

// Get User
const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
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

    const user = await request.server.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.NOT_FOUND,
        errorResponse(language).errorTitle.NOT_FOUND,
        errorResponse(language).errorMessage.NOT_FOUND
      );
    }

    const responseUser = {
      id: user.id,
      CIN: user.CIN,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return reply.status(SuccessHttpStatusCode.OK).send({
      data: responseUser,
    });
  } catch (error) {
    handleError(error, reply, language);
  }
};

// Get All Users
const getUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const {
    search,
    limit = "10",
    page = "1",
    orderByName,
  } = request.query as {
    search?: string;
    limit?: string;
    page?: string;
    orderByName?: string;
  };

  try {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const filters: Prisma.UserWhereInput = {
      deletedAt: { equals: null },
    };

    if (search) {
      filters.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { CIN: { contains: search } },
      ];
    }

    const order = orderByName
      ? { firstName: "asc" as Prisma.SortOrder }
      : { createdAt: "desc" as Prisma.SortOrder };

    // Fetch total count of users matching the filters
    const total = await request.server.prisma.user.count({
      where: filters,
    });

    const users = await request.server.prisma.user.findMany({
      where: filters,
      orderBy: order,
      skip,
      take,
    });

    const responseUsers = users.map((user) => ({
      id: user.id,
      CIN: user.CIN,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    return reply.status(SuccessHttpStatusCode.OK).send({
      data: responseUsers,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    handleError(error, reply, language);
  }
};

// Delete User (Soft Delete)
const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;

  const { userId } = request.user;
  const { id } = request.query as { id: string }; // This is the ID of the user to be deleted

  try {
    // Find the user to be deleted (not the current user)
    const userToDelete = await request.server.prisma.user.findUnique({
      where: { id: id, deletedAt: null },
    });

    if (!userId) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.BAD_REQUEST,
        errorResponse(language).errorTitle.INVALID_REQUEST,
        errorResponse(language).errorMessage.INVALID_REQUEST
      );
    }

    if (!userToDelete) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.NOT_FOUND,
        errorResponse(language).errorTitle.NOT_FOUND,
        errorResponse(language).errorMessage.NOT_FOUND
      );
    }

    // Soft delete the target user (not the current user)
    await request.server.prisma.user.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });

    await request.server.prisma.auditLog.create({
      data: {
        userId: userId,
        action: AuditAction.userDeleted,
      },
    });

    return reply.status(SuccessHttpStatusCode.OK).send({
      response: {
        statusCode: SuccessHttpStatusCode.OK,
        title: successResponse(language).successTitle.USER_DELETED,
        message: successResponse(language).successMessage.USER_DELETED,
      },
    });
  } catch (error) {
    handleError(error, reply, language);
  }
};

export default {
  getUser,
  getUsers,
  deleteUser,
};
