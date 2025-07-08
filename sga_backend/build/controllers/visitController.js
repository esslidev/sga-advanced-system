"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisits = void 0;
const client_1 = require("@prisma/client");
const errorResponses_1 = require("../core/responses/arabic/errorResponses");
const responses_1 = require("../core/responses/arabic/responses");
const prisma = new client_1.PrismaClient();
// GET Visits
const getVisits = async (request, reply) => {
    const { orderByName, id, limit = "10", page = "1" } = request.query;
    try {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const filters = {
            deletedAt: { equals: null },
            ...(id && { id }),
        };
        const order = { createdAt: "desc" };
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
            return reply.status(errorResponses_1.ErrorHttpStatusCode.NOT_FOUND).send({
                statusCode: errorResponses_1.ErrorHttpStatusCode.NOT_FOUND,
                title: errorResponses_1.ErrorTitle.VISIT_NOT_FOUND,
                message: errorResponses_1.ErrorMessage.VISIT_NOT_FOUND,
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
        return reply.status(responses_1.SuccessHttpStatusCode.OK).send({
            data: responseVisits,
        });
    }
    catch (error) {
        request.log.error(error);
        return reply.status(errorResponses_1.ErrorHttpStatusCode.BAD_REQUEST).send({
            statusCode: errorResponses_1.ErrorHttpStatusCode.BAD_REQUEST,
            title: errorResponses_1.ErrorTitle.INVALID_VISIT_DATA,
            message: errorResponses_1.ErrorMessage.INVALID_VISIT_DATA,
        });
    }
};
exports.getVisits = getVisits;
// Export default object if you want to import all at once
exports.default = {
    getVisits: exports.getVisits,
    // addVisit,
    // updateVisit,
    // deleteVisit,
};
