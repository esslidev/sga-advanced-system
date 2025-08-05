import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";
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
import { getHeaderValue } from "../../core/utils/headerValueGetter";

// GET Visitor
const getVisitor = async (
  request: FastifyRequest<{
    Querystring: { id: string };
  }>,
  reply: FastifyReply
) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const { id } = request.query;
  try {
    const visitor = await request.server.prisma.visitor.findFirst({
      where: { id, deletedAt: { equals: null } },
    });

    if (!visitor) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.NOT_FOUND,
        errorResponse(language).errorTitle.NOT_FOUND,
        errorResponse(language).errorMessage.NOT_FOUND
      );
    }

    const responseUser = {
      id: visitor.id,
      CIN: visitor.CIN,
      firstName: visitor.firstName,
      lastName: visitor.lastName,
      createdAt: visitor.createdAt.toISOString(),
      updatedAt: visitor.updatedAt.toISOString(),
    };

    return reply.status(SuccessHttpStatusCode.OK).send({ data: responseUser });
  } catch (error) {
    return handleError(error, reply, language);
  }
};

// GET Visitors
const getVisitors = async (
  request: FastifyRequest<{
    Querystring: {
      orderByName?: boolean;
      search?: string;
      limit?: string;
      page?: string;
    };
  }>,
  reply: FastifyReply
) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const { orderByName, search, limit = "10", page = "1" } = request.query;

  try {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const filters: Prisma.VisitorWhereInput = { deletedAt: { equals: null } };

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
    const total = await request.server.prisma.visitor.count({
      where: filters,
    });

    const visitors = await request.server.prisma.visitor.findMany({
      where: filters,
      orderBy: order,
      skip,
      take,
      include: {
        _count: {
          select: { visits: { where: { deletedAt: { equals: null } } } },
        },
      },
    });

    const responseVisitors = visitors.map((visitor) => ({
      id: visitor.id,
      CIN: visitor.CIN,
      firstName: visitor.firstName,
      lastName: visitor.lastName,
      visitsCount: visitor._count.visits,
      createdAt: visitor.createdAt.toISOString(),
      updatedAt: visitor.updatedAt.toISOString(),
    }));

    return reply.status(SuccessHttpStatusCode.OK).send({
      data: responseVisitors,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    return handleError(error, reply, language);
  }
};

// ADD Visitor
const addVisitor = async (
  request: FastifyRequest<{
    Body: {
      CIN: string;
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
  const { CIN, firstName, lastName } = request.body;
  try {
    const existingVisitor = await request.server.prisma.visitor.findFirst({
      where: { CIN, deletedAt: { equals: null } },
    });

    if (existingVisitor) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.CONFLICT,
        errorResponse(language).errorTitle.VISITOR_ALREADY_EXISTS,
        errorResponse(language).errorMessage.VISITOR_ALREADY_EXISTS
      );
    }

    const deletedVisitor = await request.server.prisma.visitor.findFirst({
      where: {
        CIN,
        deletedAt: { not: { equals: null } },
      },
    });

    if (deletedVisitor) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.GONE,
        errorResponse(language).errorTitle.VISITOR_DELETED_PREVIOUSLY,
        errorResponse(language).errorMessage.VISITOR_DELETED_PREVIOUSLY
      );
    }

    await request.server.prisma.visitor.create({
      data: { CIN, firstName, lastName },
    });

    return reply.status(SuccessHttpStatusCode.CREATED).send({
      response: {
        statusCode: SuccessHttpStatusCode.CREATED,
        title: successResponse(language).successTitle.VISITOR_CREATED,
        message: successResponse(language).successTitle.VISITOR_CREATED,
      },
    });
  } catch (error) {
    return handleError(error, reply, language);
  }
};

// UPDATE Visitor
const updateVisitor = async (
  request: FastifyRequest<{
    Body: {
      id: string;
      CIN?: string;
      firstName?: string;
      lastName?: string;
    };
  }>,
  reply: FastifyReply
) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const { id, CIN, firstName, lastName } = request.body;

  try {
    const existingVisitor = await request.server.prisma.visitor.findFirst({
      where: { id, deletedAt: { equals: null } },
    });

    if (!existingVisitor) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.NOT_FOUND,
        errorResponse(language).errorTitle.NOT_FOUND,
        errorResponse(language).errorMessage.NOT_FOUND
      );
    }

    const updatedVisitorData = {
      ...(CIN && { CIN }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    };

    const updatedVisitor = await request.server.prisma.visitor.update({
      where: { id },
      data: updatedVisitorData,
    });

    const responseVisitor = {
      id: updatedVisitor.id,
      CIN: updatedVisitor.CIN,
      firstName: updatedVisitor.firstName,
      lastName: updatedVisitor.lastName,
      createdAt: updatedVisitor.createdAt.toISOString(),
      updatedAt: updatedVisitor.updatedAt.toISOString(),
    };

    return reply.status(SuccessHttpStatusCode.OK).send({
      response: {
        statusCode: SuccessHttpStatusCode.OK,
        title: successResponse(language).successTitle.VISITOR_UPDATED,
        message: successResponse(language).successTitle.VISITOR_UPDATED,
      },
    });
  } catch (error) {
    return handleError(error, reply, language);
  }
};

// DELETE Visitor
const deleteVisitor = async (
  request: FastifyRequest<{
    Querystring: {
      id: string;
    };
  }>,
  reply: FastifyReply
) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const { id } = request.query;
  try {
    const visitor = await request.server.prisma.visitor.findUnique({
      where: { id },
    });

    if (!visitor) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.NOT_FOUND,
        errorResponse(language).errorTitle.NOT_FOUND,
        errorResponse(language).errorMessage.NOT_FOUND
      );
    }

    await request.server.prisma.visitor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return reply.status(SuccessHttpStatusCode.OK).send({
      response: {
        statusCode: SuccessHttpStatusCode.OK,
        title: successResponse(language).successTitle.VISITOR_DELETED,
        message: successResponse(language).successTitle.VISITOR_DELETED,
      },
    });
  } catch (error) {
    return handleError(error, reply, language);
  }
};

export default {
  getVisitor,
  getVisitors,
  addVisitor,
  updateVisitor,
  deleteVisitor,
};
