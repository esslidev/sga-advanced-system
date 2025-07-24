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

// GET Visits
export const getVisits = async (
  request: FastifyRequest<{
    Querystring: {
      visitorId: string;
      limit?: string;
      page?: string;
    };
  }>,
  reply: FastifyReply
) => {
  const { visitorId, limit = "10", page = "1" } = request.query;

  try {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const filters: Prisma.VisitWhereInput = {
      deletedAt: { equals: null },
      ...(visitorId && { visitorId }),
    };

    const order = { createdAt: "desc" as Prisma.SortOrder };

    // Fetch total count of users matching the filters
    const total = await request.server.prisma.visit.count({
      where: filters,
    });

    const visits = await request.server.prisma.visit.findMany({
      where: filters,
      orderBy: order,
      skip,
      take,
      include: { visitor: true, divisions: true },
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
      divisions: visit.divisions.map((vd) => vd.division),
      visitDate: visit.visitDate.toISOString(),
      visitReason: visit.visitReason,
      createdAt: visit.createdAt.toISOString(),
      updatedAt: visit.updatedAt.toISOString(),
    }));

    return reply.status(SuccessHttpStatusCode.OK).send({
      data: responseVisits,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / take),
      },
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

//ADD Visit
export const addVisit = async (
  request: FastifyRequest<{
    Body: {
      visitDate: Date;
      divisions: Division[];
      visitReason: string;
      visitor: {
        CIN: string;
        firstName: string;
        lastName: string;
      };
    };
  }>,
  reply: FastifyReply
) => {
  const { visitDate, divisions, visitReason, visitor } = request.body;

  try {
    const existingVisitor = await request.server.prisma.visitor.findUnique({
      where: { CIN: visitor.CIN },
    });

    // If visitor exists
    if (existingVisitor) {
      // Soft delete check
      if (existingVisitor.deletedAt) {
        return reply.status(ErrorHttpStatusCode.GONE).send({
          statusCode: ErrorHttpStatusCode.GONE,
          title: ErrorTitle.VISITOR_DELETED_PREVIOUSLY,
          message: ErrorMessage.VISITOR_DELETED_PREVIOUSLY,
        });
      }

      // Name mismatch check
      const nameMismatch =
        existingVisitor.firstName.trim() !== visitor.firstName.trim() ||
        existingVisitor.lastName.trim() !== visitor.lastName.trim();

      if (nameMismatch) {
        return reply.status(ErrorHttpStatusCode.CONFLICT).send({
          statusCode: ErrorHttpStatusCode.CONFLICT,
          title: ErrorTitle.VISITOR_NAME_MISMATCH,
          message: ErrorMessage.VISITOR_NAME_MISMATCH,
        });
      }
    } else {
      // Create visitor if not found
      await request.server.prisma.visitor.create({
        data: {
          CIN: visitor.CIN,
          firstName: visitor.firstName,
          lastName: visitor.lastName,
        },
      });
    }

    request.log.info("divisions:", divisions);

    // Register the visit
    await request.server.prisma.visit.create({
      data: {
        visitor: { connect: { CIN: visitor.CIN } },
        visitDate,
        visitReason,
        divisions: {
          create: divisions.map((division) => ({
            division,
          })),
        },
      },
    });

    return reply.status(SuccessHttpStatusCode.CREATED).send({
      statusCode: SuccessHttpStatusCode.CREATED,
      title: SuccessTitle.VISIT_REGISTERED,
      message: SuccessMessage.VISIT_REGISTERED,
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
      visitDate?: Date;
      visitTime?: Date;
      divisions?: string[];
      visitReason?: string;
    };
  }>,
  reply: FastifyReply
) => {
  const { id, visitorCIN, divisions, visitReason } = request.body;

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
      ...(visitorCIN && { visitor: { connect: { CIN: visitorCIN } } }),
      ...(divisions && {
        divisions: {
          set: divisions.map((divisionId) => ({ id: divisionId })),
        },
      }),
      ...(visitReason && { visitReason }),
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
