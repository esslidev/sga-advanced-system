import { PrismaClient } from "@prisma/client";
import {
  ErrorHttpStatusCode,
  ErrorTitle,
  ErrorMessage,
} from "../core/responses/errorResponses.js";
import {
  SuccessHttpStatusCode,
  SuccessTitle,
  SuccessMessage,
} from "../core/responses/responses.js";
const prisma = new PrismaClient();

// GET Visitor
const getVisitor = async (req, res) => {
  const { id } = req.query;

  try {
    const visitor = await prisma.visitor.findUnique({
      where: { id: id, deletedAt: null },
    });

    if (!visitor) {
      res.status(ErrorHttpStatusCode.NOT_FOUND).send({
        statusCode: ErrorHttpStatusCode.NOT_FOUND,
        title: ErrorTitle.NOT_FOUND,
        message: ErrorMessage.NOT_FOUND,
      });
    } else {
      const responseUser = {
        id: visitor.id,
        CIN: visitor.CIN,
        firstName: visitor.firstName,
        lastName: visitor.lastName,
        createdAt: visitor.createdAt,
        updatedAt: visitor.updatedAt,
      };

      res.status(SuccessHttpStatusCode.OK).send({ data: responseUser });
    }
  } catch (error) {
    res.status(ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
      statusCode: ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
      title: ErrorTitle.INTERNAL_SERVER_ERROR,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

// GET Visitors
const getVisitors = async (req, res) => {
  const { orderByName, search, limit = 10, page = 1 } = req.query;

  try {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const filters = { deletedAt: null };

    if (search) {
      filters.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { CIN: { contains: search } },
      ];
    }

    const order = orderByName ? { firstName: "asc" } : { createdAt: "desc" };
    const visitors = await prisma.visitor.findMany({
      where: filters,
      orderBy: order,
      skip: skip,
      take: take,
    });

    const responseVisitors = visitors.map((visitor) => ({
      id: visitor.id,
      CIN: visitor.CIN,
      firstName: visitor.firstName,
      lastName: visitor.lastName,
      createdAt: visitor.createdAt.toISOString(),
      updatedAt: visitor.updatedAt.toISOString(),
    }));

    res.status(SuccessHttpStatusCode.OK).send({ data: responseVisitors });
  } catch (error) {
    res.status(ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
      statusCode: ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
      title: ErrorTitle.INTERNAL_SERVER_ERROR,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

// ADD Visitors
const addVisitor = async (req, res) => {
  const { CIN, firstName, lastName } = req.body;
  try {
    const existingVisitor = await prisma.visitor.findFirst({
      where: {
        CIN: CIN,
        deletedAt: null,
      },
    });

    if (existingVisitor != null) {
      res.status(ErrorHttpStatusCode.BAD_REQUEST).send({
        statusCode: ErrorHttpStatusCode.BAD_REQUEST,
        title: ErrorTitle.VISITOR_ALREADY_EXISTS,
        message: ErrorMessage.VISITOR_ALREADY_EXISTS,
      });
    } else {
      const deletedVisitor = await prisma.visitor.findFirst({
        where: {
          CIN: CIN,
          deletedAt: {
            not: null,
          },
        },
      });
      if (deletedVisitor != null) {
        res.status(ErrorHttpStatusCode.BAD_REQUEST).send({
          statusCode: ErrorHttpStatusCode.BAD_REQUEST,
          title: ErrorTitle.VISITOR_DELETED_PREVIOUSLY,
          message: ErrorMessage.VISITOR_DELETED_PREVIOUSLY,
        });
      } else {
        await prisma.visitor.create({
          data: {
            CIN: CIN,
            firstName: firstName,
            lastName: lastName,
          },
        });
      }

      res.status(SuccessHttpStatusCode.OK).send({
        statusCode: SuccessHttpStatusCode.OK,
        title: SuccessTitle.VISITOR_CREATED,
        message: SuccessMessage.VISITOR_CREATED,
      });
    }
  } catch (error) {
    res.status(ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
      statusCode: ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
      title: ErrorTitle.INTERNAL_SERVER_ERROR,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

// UPDATE Visitor
const updateVisitor = async (req, res) => {
  const { id, CIN, firstName, lastName } = req.body;

  try {
    let existingVisitor = await prisma.visitor.findUnique({
      where: { id: id, deletedAt: null },
    });

    if (!existingVisitor) {
      res.status(ErrorHttpStatusCode.BAD_REQUEST).send({
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

    let updateVisitor = await prisma.visitor.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: updatedVisitorData,
    });

    const responseVisitor = {
      id: updateVisitor.id,
      CIN: updateVisitor.CIN,
      firstName: updateVisitor.firstName,
      lastName: updateVisitor.lastName,
      createdAt: updateVisitor.createdAt.toDateString(),
      updatedAt: updateVisitor.updatedAt.toISOString(),
    };

    res.status(SuccessHttpStatusCode.OK).send({ data: responseVisitor });
  } catch (error) {
    res.status(ErrorHttpStatusCode.INTERNAL_SERVER_ERROR).send({
      statusCode: ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
      title: ErrorTitle.INTERNAL_SERVER_ERROR,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

// DELETE Visitor
const deleteVisitor = async (req, res) => {
  const { id } = req.query;

  try {
    const visitor = await prisma.visitor.findUnique({ where: { id: id } });
    if (!visitor) {
      res.status(ErrorHttpStatusCode.NOT_FOUND).send({
        statusCode: ErrorHttpStatusCode.NOT_FOUND,
        title: ErrorTitle.NOT_FOUND,
        message: ErrorMessage.NOT_FOUND,
      });
    } else {
      await prisma.visitor.update({
        where: { id: id },
        data: { deletedAt: new Date() },
      });

      res.status(SuccessHttpStatusCode.OK).send({
        statusCode: SuccessHttpStatusCode.ACCEPTED,
        title: SuccessTitle.VISITOR_DELETED,
        message: SuccessMessage.VISITOR_DELETED,
      });
    }
  } catch (error) {
    res.status(ErrorHttpStatusCode.NOT_FOUND).send({
      statusCode: ErrorHttpStatusCode.NOT_FOUND,
      title: ErrorTitle.NOT_FOUND,
      message: ErrorMessage.NOT_FOUND,
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
