import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
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
  const { orderByName, id, limit = "10", page = "1" } = request.query;

  try {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const filters: Prisma.VisitWhereInput = {
      deletedAt: { equals: null },
      ...(id && { id }),
    };

    const order = { createdAt: "desc" as Prisma.SortOrder };

    // If you want to order by visitor's name or something else,
    // you can implement it here depending on your schema

    const visits = await prisma.visit.findMany({
      where: filters,
      orderBy: order,
      skip,
      take,
      include: { visitor: true }, // include related visitor data if needed
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
      visitor: visit.visitor,
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

// Export default object if you want to import all at once
export default {
  getVisits,
  // addVisit,
  // updateVisit,
  // deleteVisit,
};
