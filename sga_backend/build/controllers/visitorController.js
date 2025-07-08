"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVisitor = exports.updateVisitor = exports.addVisitor = exports.getVisitors = exports.getVisitor = void 0;
const errorResponses_1 = require("../core/responses/arabic/errorResponses");
const responses_1 = require("../core/responses/arabic/responses");
// GET Visitor
const getVisitor = async (request, reply) => {
    const { id } = request.query;
    try {
        const visitor = await request.server.prisma.visitor.findFirst({
            where: { id, deletedAt: { equals: null } },
        });
        if (!visitor) {
            return reply.status(errorResponses_1.ErrorHttpStatusCode.NOT_FOUND).send({
                statusCode: errorResponses_1.ErrorHttpStatusCode.NOT_FOUND,
                title: errorResponses_1.ErrorTitle.NOT_FOUND,
                message: errorResponses_1.ErrorMessage.NOT_FOUND,
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
        return reply.status(responses_1.SuccessHttpStatusCode.OK).send({ data: responseUser });
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
exports.getVisitor = getVisitor;
// GET Visitors
const getVisitors = async (request, reply) => {
    const { orderByName, search, limit = "10", page = "1" } = request.query;
    try {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const filters = { deletedAt: { equals: null } };
        if (search) {
            filters.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { CIN: { contains: search } },
            ];
        }
        const order = orderByName
            ? { firstName: "asc" }
            : { createdAt: "desc" };
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
            .status(responses_1.SuccessHttpStatusCode.OK)
            .send({ data: responseVisitors });
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
exports.getVisitors = getVisitors;
// ADD Visitor
const addVisitor = async (request, reply) => {
    const { CIN, firstName, lastName } = request.body;
    try {
        const existingVisitor = await request.server.prisma.visitor.findFirst({
            where: { CIN, deletedAt: { equals: null } },
        });
        if (existingVisitor) {
            return reply.status(errorResponses_1.ErrorHttpStatusCode.BAD_REQUEST).send({
                statusCode: errorResponses_1.ErrorHttpStatusCode.BAD_REQUEST,
                title: errorResponses_1.ErrorTitle.VISITOR_ALREADY_EXISTS,
                message: errorResponses_1.ErrorMessage.VISITOR_ALREADY_EXISTS,
            });
        }
        const deletedVisitor = await request.server.prisma.visitor.findFirst({
            where: {
                CIN,
                deletedAt: { not: { equals: null } },
            },
        });
        if (deletedVisitor) {
            return reply.status(errorResponses_1.ErrorHttpStatusCode.BAD_REQUEST).send({
                statusCode: errorResponses_1.ErrorHttpStatusCode.BAD_REQUEST,
                title: errorResponses_1.ErrorTitle.VISITOR_DELETED_PREVIOUSLY,
                message: errorResponses_1.ErrorMessage.VISITOR_DELETED_PREVIOUSLY,
            });
        }
        await request.server.prisma.visitor.create({
            data: { CIN, firstName, lastName },
        });
        return reply.status(responses_1.SuccessHttpStatusCode.OK).send({
            statusCode: responses_1.SuccessHttpStatusCode.OK,
            title: responses_1.SuccessTitle.VISITOR_CREATED,
            message: responses_1.SuccessMessage.VISITOR_CREATED,
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
exports.addVisitor = addVisitor;
// UPDATE Visitor
const updateVisitor = async (request, reply) => {
    const { id, CIN, firstName, lastName } = request.body;
    try {
        const existingVisitor = await request.server.prisma.visitor.findFirst({
            where: { id, deletedAt: { equals: null } },
        });
        if (!existingVisitor) {
            return reply.status(errorResponses_1.ErrorHttpStatusCode.NOT_FOUND).send({
                statusCode: errorResponses_1.ErrorHttpStatusCode.NOT_FOUND,
                title: errorResponses_1.ErrorTitle.NOT_FOUND,
                message: errorResponses_1.ErrorMessage.NOT_FOUND,
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
            .status(responses_1.SuccessHttpStatusCode.OK)
            .send({ data: responseVisitor });
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
exports.updateVisitor = updateVisitor;
// DELETE Visitor
const deleteVisitor = async (request, reply) => {
    const { id } = request.query;
    try {
        const visitor = await request.server.prisma.visitor.findUnique({
            where: { id },
        });
        if (!visitor) {
            return reply.status(errorResponses_1.ErrorHttpStatusCode.NOT_FOUND).send({
                statusCode: errorResponses_1.ErrorHttpStatusCode.NOT_FOUND,
                title: errorResponses_1.ErrorTitle.NOT_FOUND,
                message: errorResponses_1.ErrorMessage.NOT_FOUND,
            });
        }
        await request.server.prisma.visitor.update({
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
exports.deleteVisitor = deleteVisitor;
exports.default = {
    getVisitor: exports.getVisitor,
    getVisitors: exports.getVisitors,
    addVisitor: exports.addVisitor,
    updateVisitor: exports.updateVisitor,
    deleteVisitor: exports.deleteVisitor,
};
