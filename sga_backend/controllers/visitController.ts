import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, PrismaClient, Division } from "@prisma/client";
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
import { promises } from "dns";

const prisma = new PrismaClient();

// GET Visits
export const getVisits = async (
  request: FastifyRequest<{
    Querystring: {
      orderByName?: string;
      id?: string;
      limit?: string;
      page?: string;
    };
  }>,
  reply: FastifyReply
) => {
  const { id, limit = "10", page = "1" } = request.query;

  try {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const filters: Prisma.VisitWhereInput = {
      deletedAt: { equals: null },
      ...(id && { id }),
    };

    const order = { createdAt: "desc" as Prisma.SortOrder };

    const visits = await prisma.visit.findMany({
      where: filters,
      orderBy: order,
      skip,
      take,
      include: { visitor: true },
    });

    if (visits.length === 0) {
      return reply.status(ErrorHttpStatusCode.NOT_FOUND).send({
        statusCode: ErrorHttpStatusCode.NOT_FOUND,
        title: ErrorTitle.VISIT_NOT_FOUND,
        message: ErrorMessage.VISIT_NOT_FOUND,
      });
    }

    const responseVisits = visits.map((visit) => ({
      id: visit.id,
      visitorCIN: visit.visitorCIN,
      division: visit.division,
      visitReason: visit.visitReason,
      visitor: {
        id: visit.visitor.id,
        CIN: visit.visitor.CIN,
        firstName: visit.visitor.firstName,
        lastName: visit.visitor.lastName,
        createdAt: visit.visitor.createdAt,
        updatedAt: visit.visitor.updatedAt,
      },
      createdAt: visit.createdAt.toISOString(),
      updatedAt: visit.updatedAt.toISOString(),
    }));

    return reply.status(SuccessHttpStatusCode.OK).send({
      data: responseVisits,
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(ErrorHttpStatusCode.BAD_REQUEST).send({
      statusCode: ErrorHttpStatusCode.BAD_REQUEST,
      title: ErrorTitle.INVALID_VISIT_DATA,
      message: ErrorMessage.INVALID_VISIT_DATA,
    });
  }
};

// ADD Visit
export const addVisit = async (
  request: FastifyRequest<{
    Body: {
      visitorCIN: string;
      division: string;
      visitReason: string;
      visitor: object;
    };
  }>,
  reply: FastifyReply
) => {
  const { visitorCIN, division, visitReason } = request.body;
  try {
    const dataInsert: any = {
      visitorCIN: visitorCIN,
      division: division,
      visitReason: visitReason,
    };
    await request.server.prisma.visit.create({
      data: dataInsert,
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

// UPDATE Visit
export const updateVisit = async (
  request: FastifyRequest<{
    Body: {
      id: string;
      visitorCIN?: string;
      division: string;
      visitReason: string;
    };
  }>,
  reply: FastifyReply
) => {
  const { id, visitorCIN, division, visitReason } = request.body;

  try {
    const existingVisit = await request.server.prisma.visit.findFirst({
      where: { id, deletedAt: { equals: null } },
    });

    if (!existingVisit) {
      return reply.status(ErrorHttpStatusCode.NOT_FOUND).send({
        statusCode: ErrorHttpStatusCode.NOT_FOUND,
        title: ErrorTitle.NOT_FOUND,
        message: ErrorMessage.NOT_FOUND,
      });
    }

    const updatedVisitData = {
      ...(division && { division: division as Division }),
      ...(visitReason && { visitReason }),
      ...(visitorCIN && { visitor: { connect: { CIN: visitorCIN } } }),
    };

    const updatedVisit = await request.server.prisma.visit.update({
      where: { id },
      data: updatedVisitData,
    });

    const responseVisit = {
      id: updatedVisit.id,
    };

    return reply.status(SuccessHttpStatusCode.OK).send({ data: responseVisit });
  } catch (error) {
    request.log.error(error);
    return reply.status(ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
      statusCode: ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
      title: ErrorTitle.INTERNAL_SERVER_ERROR,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

// DELETE Visit
export const deleteVisit = async (
  request: FastifyRequest<{
    Querystring: {
      id: string;
    };
  }>,
  reply: FastifyReply
) => {
  const { id } = request.query;
  try {
    const visit = await request.server.prisma.visit.findUnique({
      where: { id },
    });

    if (!visit) {
      return reply.status(ErrorHttpStatusCode.NOT_FOUND).send({
        statusCode: ErrorHttpStatusCode.NOT_FOUND,
        title: ErrorTitle.NOT_FOUND,
        message: ErrorMessage.NOT_FOUND,
      });
    }

    await request.server.prisma.visit.update({
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
  getVisits,
  addVisit,
  updateVisit,
  deleteVisit,
};
