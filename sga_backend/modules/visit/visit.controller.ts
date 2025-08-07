import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, Division } from "@prisma/client";
import {
  ErrorHttpStatusCode,
  SuccessHttpStatusCode,
} from "../../core/enums/responses/responseStatusCode";
import { handleError } from "../../core/utils/errorHandler";
import { ResponseLanguage } from "../../core/enums/responses/responseLanguage";
import { HttpErrorResponse } from "../../core/resources/response/httpErrorResponse";
import {
  errorResponse,
  successResponse,
} from "../../core/resources/response/localizedResponse";
import { getHeaderValue } from "../../core/utils/headerValueGetter";

// GET Visits
const getVisits = async (request: FastifyRequest, reply: FastifyReply) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const {
    visitorId,
    limit = "10",
    page = "1",
  } = request.query as {
    visitorId: string;
    limit?: string;
    page?: string;
  };

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
    return handleError(error, reply, language);
  }
};

//ADD Visit
const addVisit = async (
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
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const { visitDate, divisions, visitReason, visitor } = request.body;

  try {
    const existingVisitor = await request.server.prisma.visitor.findUnique({
      where: { CIN: visitor.CIN },
    });

    // If visitor exists
    if (existingVisitor) {
      // Soft delete check
      if (existingVisitor.deletedAt) {
        throw new HttpErrorResponse(
          ErrorHttpStatusCode.GONE,
          errorResponse(language).errorTitle.VISITOR_DELETED_PREVIOUSLY,
          errorResponse(language).errorMessage.VISITOR_DELETED_PREVIOUSLY
        );
      }

      // Name mismatch check
      const nameMismatch =
        existingVisitor.firstName.trim() !== visitor.firstName.trim() ||
        existingVisitor.lastName.trim() !== visitor.lastName.trim();

      if (nameMismatch) {
        throw new HttpErrorResponse(
          ErrorHttpStatusCode.CONFLICT,
          errorResponse(language).errorTitle.VISITOR_NAME_MISMATCH,
          errorResponse(language).errorMessage.VISITOR_NAME_MISMATCH
        );
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
      response: {
        statusCode: SuccessHttpStatusCode.CREATED,
        title: successResponse(language).successTitle.VISIT_REGISTERED,
        message: successResponse(language).successTitle.VISIT_REGISTERED,
      },
    });
  } catch (error) {
    return handleError(error, reply, language);
  }
};

// UPDATE Visit
const updateVisit = async (
  request: FastifyRequest<{
    Body: {
      id: string;
      visitorCIN?: string;
      visitDate?: Date;
      divisions?: Division[];
      visitReason?: string;
    };
  }>,
  reply: FastifyReply
) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;
  const { id, visitorCIN, divisions, visitDate, visitReason } = request.body;

  try {
    // Check existing Visit
    const existingVisit = await request.server.prisma.visit.findUnique({
      where: { id },
      include: { divisions: true },
    });

    if (!existingVisit) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.NOT_FOUND,
        errorResponse(language).errorTitle.NOT_FOUND,
        errorResponse(language).errorMessage.NOT_FOUND
      );
    }

    // update data (excluding divisions)
    const updateData: any = {
      ...(visitorCIN && { visitor: { connect: { CIN: visitorCIN } } }),
      ...(visitReason && { visitReason }),
      ...(visitDate && { visitDate }),
    };

    // Use transaction to update Visit and VisitDivision join table
    await request.server.prisma.$transaction(async (tx) => {
      // Update Visit (non-relations)
      await tx.visit.update({
        where: { id },
        data: updateData,
      });

      // If divisions provided, update VisitDivision rows
      if (divisions) {
        // Delete existing VisitDivisions for this Visit
        await tx.visitDivision.deleteMany({
          where: { visitId: id },
        });

        // Create new VisitDivision rows for each division enum value
        const newVisitDivisions = divisions.map((division) => ({
          visitId: id,
          division,
        }));

        await tx.visitDivision.createMany({
          data: newVisitDivisions,
        });
      }
    });

    return reply.status(SuccessHttpStatusCode.OK).send({
      response: {
        statusCode: SuccessHttpStatusCode.OK,
        title: successResponse(language).successTitle.VISIT_UPDATED,
        message: successResponse(language).successTitle.VISIT_UPDATED,
      },
    });
  } catch (error) {
    return handleError(error, reply, language);
  }
};

// DELETE Visit
const deleteVisit = async (
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
    const visit = await request.server.prisma.visit.findUnique({
      where: { id },
    });

    if (!visit) {
      throw new HttpErrorResponse(
        ErrorHttpStatusCode.NOT_FOUND,
        errorResponse(language).errorTitle.NOT_FOUND,
        errorResponse(language).errorMessage.NOT_FOUND
      );
    }

    await request.server.prisma.visit.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return reply.status(SuccessHttpStatusCode.OK).send({
      response: {
        statusCode: SuccessHttpStatusCode.OK,
        title: successResponse(language).successTitle.VISIT_DELETED,
        message: successResponse(language).successTitle.VISIT_DELETED,
      },
    });
  } catch (error) {
    return handleError(error, reply, language);
  }
};

export default {
  getVisits,
  addVisit,
  updateVisit,
  deleteVisit,
};
