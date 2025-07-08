import { FastifyRequest, FastifyReply } from "fastify";
import {
  ErrorHttpStatusCode,
  ErrorTitle,
  ErrorMessage,
} from "../core/responses/arabic/errorResponses";
import {
  SuccessHttpStatusCode,
  SuccessTitle,
  SuccessMessage,
} from "../core/responses/arabic/responses";
import { Prisma } from "@prisma/client";

// GET Visitor
export const getVisitor = async (
  request: FastifyRequest<{ Querystring: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.query;
  try {
    const visitor = await request.server.prisma.visitor.findFirst({
      where: { id, deletedAt: { equals: null } },
    });

    if (!visitor) {
      return reply.status(ErrorHttpStatusCode.NOT_FOUND).send({
        statusCode: ErrorHttpStatusCode.NOT_FOUND,
        title: ErrorTitle.NOT_FOUND,
        message: ErrorMessage.NOT_FOUND,
      });
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
    request.log.error(error);
    return reply.status(ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
      statusCode: ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
      title: ErrorTitle.INTERNAL_SERVER_ERROR,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

// GET Visitors
export const getVisitors = async (
  request: FastifyRequest<{
    Querystring: {
      orderByName?: string;
      search?: string;
      limit?: string;
      page?: string;
    };
  }>,
  reply: FastifyReply
) => {
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

    const visitors = await request.server.prisma.visitor.findMany({
      where: filters,
      orderBy: order,
      skip,
      take,
    });

    const responseVisitors = visitors.map((visitor) => ({
      id: visitor.id,
      CIN: visitor.CIN,
      firstName: visitor.firstName,
      lastName: visitor.lastName,
      createdAt: visitor.createdAt.toISOString(),
      updatedAt: visitor.updatedAt.toISOString(),
    }));

    return reply
      .status(SuccessHttpStatusCode.OK)
      .send({ data: responseVisitors });
  } catch (error) {
    request.log.error(error);
    return reply.status(ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
      statusCode: ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
      title: ErrorTitle.INTERNAL_SERVER_ERROR,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

// ADD Visitor
export const addVisitor = async (
  request: FastifyRequest<{
    Body: {
      CIN: string;
      firstName: string;
      lastName: string;
    };
  }>,
  reply: FastifyReply
) => {
  const { CIN, firstName, lastName } = request.body;
  try {
    const existingVisitor = await request.server.prisma.visitor.findFirst({
      where: { CIN, deletedAt: { equals: null } },
    });

    if (existingVisitor) {
      return reply.status(ErrorHttpStatusCode.BAD_REQUEST).send({
        statusCode: ErrorHttpStatusCode.BAD_REQUEST,
        title: ErrorTitle.VISITOR_ALREADY_EXISTS,
        message: ErrorMessage.VISITOR_ALREADY_EXISTS,
      });
    }

    const deletedVisitor = await request.server.prisma.visitor.findFirst({
      where: {
        CIN,
        deletedAt: { not: { equals: null } },
      },
    });

    if (deletedVisitor) {
      return reply.status(ErrorHttpStatusCode.BAD_REQUEST).send({
        statusCode: ErrorHttpStatusCode.BAD_REQUEST,
        title: ErrorTitle.VISITOR_DELETED_PREVIOUSLY,
        message: ErrorMessage.VISITOR_DELETED_PREVIOUSLY,
      });
    }

    await request.server.prisma.visitor.create({
      data: { CIN, firstName, lastName },
    });

    return reply.status(SuccessHttpStatusCode.OK).send({
      statusCode: SuccessHttpStatusCode.OK,
      title: SuccessTitle.VISITOR_CREATED,
      message: SuccessMessage.VISITOR_CREATED,
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
      statusCode: ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
      title: ErrorTitle.INTERNAL_SERVER_ERROR,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

// UPDATE Visitor
export const updateVisitor = async (
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
  const { id, CIN, firstName, lastName } = request.body;

  try {
    const existingVisitor = await request.server.prisma.visitor.findFirst({
      where: { id, deletedAt: { equals: null } },
    });

    if (!existingVisitor) {
      return reply.status(ErrorHttpStatusCode.NOT_FOUND).send({
        statusCode: ErrorHttpStatusCode.NOT_FOUND,
        title: ErrorTitle.NOT_FOUND,
        message: ErrorMessage.NOT_FOUND,
      });
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

    return reply
      .status(SuccessHttpStatusCode.OK)
      .send({ data: responseVisitor });
  } catch (error) {
    request.log.error(error);
    return reply.status(ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
      statusCode: ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
      title: ErrorTitle.INTERNAL_SERVER_ERROR,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

// DELETE Visitor
export const deleteVisitor = async (
  request: FastifyRequest<{
    Querystring: {
      id: string;
    };
  }>,
  reply: FastifyReply
) => {
  const { id } = request.query;
  try {
    const visitor = await request.server.prisma.visitor.findUnique({
      where: { id },
    });

    if (!visitor) {
      return reply.status(ErrorHttpStatusCode.NOT_FOUND).send({
        statusCode: ErrorHttpStatusCode.NOT_FOUND,
        title: ErrorTitle.NOT_FOUND,
        message: ErrorMessage.NOT_FOUND,
      });
    }

    await request.server.prisma.visitor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return reply.status(SuccessHttpStatusCode.ACCEPTED).send({
      statusCode: SuccessHttpStatusCode.ACCEPTED,
      title: SuccessTitle.VISITOR_DELETED,
      message: SuccessMessage.VISITOR_DELETED,
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
      statusCode: ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
      title: ErrorTitle.INTERNAL_SERVER_ERROR,
      message: ErrorMessage.INTERNAL_ERROR,
    });
  }
};

export default {
  getVisitor,
  getVisitors,
  addVisitor,
  updateVisitor,
  deleteVisitor,
};
