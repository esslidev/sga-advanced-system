import { FastifyRequest, FastifyReply } from "fastify";
import { getHeaderValue } from "../../core/utils/headerValueGetter";
import { ResponseLanguage } from "../../core/enums/responses/responseLanguage";
import { SuccessHttpStatusCode } from "../../core/enums/responses/responseStatusCode";
import { handleError } from "../../core/utils/errorHandler";
import { AuditAction, Prisma } from "@prisma/client";

const getLogs = async (request: FastifyRequest, reply: FastifyReply) => {
  const language = getHeaderValue(
    request.headers,
    "language",
    ResponseLanguage.ARABIC
  )!;

  const {
    userId,
    searchByAction,
    limit = "10",
    page = "1",
  } = request.query as {
    userId?: string;
    searchByAction?: AuditAction;
    limit?: string;
    page?: string;
  };

  try {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const filters: Prisma.AuditLogWhereInput = {
      ...(userId && { userId }),
      ...(searchByAction && { action: searchByAction }),
    };

    const order = { createdAt: "desc" as Prisma.SortOrder };

    const total = await request.server.prisma.auditLog.count({
      where: filters,
    });

    const logs = await request.server.prisma.auditLog.findMany({
      where: filters,
      orderBy: order,
      skip,
      take,
    });

    const responseLogs = logs.map((log) => ({
      id: log.id,
      userId: log.userId,
      action: log.action,
      metadata: log.metadata,
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
    }));

    return reply.status(SuccessHttpStatusCode.OK).send({
      data: responseLogs,
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

export default {
  getLogs,
};
