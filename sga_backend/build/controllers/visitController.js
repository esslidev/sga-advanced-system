"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVisit = exports.updateVisit = exports.addVisit = exports.getVisits = void 0;
const client_1 = require("@prisma/client");
const errorResponses_1 = require("../core/responses/arabic/errorResponses");
const responses_1 = require("../core/responses/arabic/responses");
const prisma = new client_1.PrismaClient();
// GET Visits
const getVisits = async (request, reply) => {
    const { id, limit = "10", page = "1" } = request.query;
    try {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const filters = {
            deletedAt: { equals: null },
            ...(id && { id }),
        };
        const order = { createdAt: "desc" };
        const visits = await prisma.visit.findMany({
            where: filters,
            orderBy: order,
            skip,
            take,
            include: { visitor: true },
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
//ADD Visit
const addVisit = async (request, reply) => {
    const { visitorCIN, visitDate, visitTime, division, visitReason, visitor } = request.body;
    try {
        const existingVisitor = await request.server.prisma.visitor.findUnique({
            where: { CIN: visitorCIN },
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
                    CIN: visitorCIN,
                    firstName: visitor.firstName,
                    lastName: visitor.lastName,
                },
            });
        }
        // Register the visit
        await request.server.prisma.visit.create({
            data: {
                visitorCIN,
                visitDate,
                visitTime,
                division,
                visitReason,
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
    const { id, visitorCIN, division, visitReason } = request.body;
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
            ...(division && { division: division }),
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
