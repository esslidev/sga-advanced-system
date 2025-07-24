"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVisit = exports.updateVisit = exports.addVisit = exports.getVisits = void 0;
const errorResponses_1 = require("../core/responses/arabic/errorResponses");
const responses_1 = require("../core/responses/arabic/responses");
// GET Visits
const getVisits = async (request, reply) => {
    const { visitorId, limit = "10", page = "1" } = request.query;
    try {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const filters = {
            deletedAt: { equals: null },
            ...(visitorId && { visitorId }),
        };
        const order = { createdAt: "desc" };
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
            return reply.status(errorResponses_1.ErrorHttpStatusCode.NOT_FOUND).send({
                statusCode: errorResponses_1.ErrorHttpStatusCode.NOT_FOUND,
                title: errorResponses_1.ErrorTitle.VISIT_NOT_FOUND,
                message: errorResponses_1.ErrorMessage.VISIT_NOT_FOUND,
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
        return reply.status(responses_1.SuccessHttpStatusCode.OK).send({
            data: responseVisits,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / take),
            },
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
//ADD Visit
const addVisit = async (request, reply) => {
    const { visitDate, divisions, visitReason, visitor } = request.body;
    try {
        const existingVisitor = await request.server.prisma.visitor.findUnique({
            where: { CIN: visitor.CIN },
        });
        // If visitor exists
        if (existingVisitor) {
            // Soft delete check
            if (existingVisitor.deletedAt) {
                return reply.status(errorResponses_1.ErrorHttpStatusCode.GONE).send({
                    statusCode: errorResponses_1.ErrorHttpStatusCode.GONE,
                    title: errorResponses_1.ErrorTitle.VISITOR_DELETED_PREVIOUSLY,
                    message: errorResponses_1.ErrorMessage.VISITOR_DELETED_PREVIOUSLY,
                });
            }
            // Name mismatch check
            const nameMismatch = existingVisitor.firstName.trim() !== visitor.firstName.trim() ||
                existingVisitor.lastName.trim() !== visitor.lastName.trim();
            if (nameMismatch) {
                return reply.status(errorResponses_1.ErrorHttpStatusCode.CONFLICT).send({
                    statusCode: errorResponses_1.ErrorHttpStatusCode.CONFLICT,
                    title: errorResponses_1.ErrorTitle.VISITOR_NAME_MISMATCH,
                    message: errorResponses_1.ErrorMessage.VISITOR_NAME_MISMATCH,
                });
            }
        }
        else {
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
        return reply.status(responses_1.SuccessHttpStatusCode.CREATED).send({
            statusCode: responses_1.SuccessHttpStatusCode.CREATED,
            title: responses_1.SuccessTitle.VISIT_REGISTERED,
            message: responses_1.SuccessMessage.VISIT_REGISTERED,
        });
    }
    catch (error) {
        request.log.error(error);
        return reply.status(errorResponses_1.ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
            statusCode: errorResponses_1.ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
            title: errorResponses_1.ErrorTitle.INTERNAL_SERVER_ERROR,
            message: errorResponses_1.ErrorMessage.INTERNAL_SERVER_ERROR,
        });
    }
};
exports.addVisit = addVisit;
// UPDATE Visit
const updateVisit = async (request, reply) => {
    const { id, visitorCIN, divisions, visitReason } = request.body;
    try {
        const existingVisit = await request.server.prisma.visit.findFirst({
            where: { id, deletedAt: { equals: null } },
        });
        if (!existingVisit) {
            return reply.status(errorResponses_1.ErrorHttpStatusCode.NOT_FOUND).send({
                statusCode: errorResponses_1.ErrorHttpStatusCode.NOT_FOUND,
                title: errorResponses_1.ErrorTitle.NOT_FOUND,
                message: errorResponses_1.ErrorMessage.NOT_FOUND,
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
        return reply.status(responses_1.SuccessHttpStatusCode.OK).send({ data: responseVisit });
    }
    catch (error) {
        request.log.error(error);
        return reply.status(errorResponses_1.ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
            statusCode: errorResponses_1.ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
            title: errorResponses_1.ErrorTitle.INTERNAL_SERVER_ERROR,
            message: errorResponses_1.ErrorMessage.INTERNAL_SERVER_ERROR,
        });
    }
};
exports.updateVisit = updateVisit;
// DELETE Visit
const deleteVisit = async (request, reply) => {
    const { id } = request.query;
    try {
        const visit = await request.server.prisma.visit.findUnique({
            where: { id },
        });
        if (!visit) {
            return reply.status(errorResponses_1.ErrorHttpStatusCode.NOT_FOUND).send({
                statusCode: errorResponses_1.ErrorHttpStatusCode.NOT_FOUND,
                title: errorResponses_1.ErrorTitle.NOT_FOUND,
                message: errorResponses_1.ErrorMessage.NOT_FOUND,
            });
        }
        await request.server.prisma.visit.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return reply.status(responses_1.SuccessHttpStatusCode.ACCEPTED).send({
            statusCode: responses_1.SuccessHttpStatusCode.ACCEPTED,
            title: responses_1.SuccessTitle.VISITOR_DELETED,
            message: responses_1.SuccessMessage.VISITOR_DELETED,
        });
    }
    catch (error) {
        request.log.error(error);
        return reply.status(errorResponses_1.ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
            statusCode: errorResponses_1.ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
            title: errorResponses_1.ErrorTitle.INTERNAL_SERVER_ERROR,
            message: errorResponses_1.ErrorMessage.INTERNAL_ERROR,
        });
    }
};
exports.deleteVisit = deleteVisit;
exports.default = {
    getVisits: exports.getVisits,
    addVisit: exports.addVisit,
    updateVisit: exports.updateVisit,
    deleteVisit: exports.deleteVisit,
};
