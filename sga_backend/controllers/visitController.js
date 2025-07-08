import { Division, Prisma, PrismaClient } from "@prisma/client";
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

// GET Visits
const getVisits = async (req, res) => {
  const { orderByName, id, limit = 10, page = 1 } = req.query;
  try {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const filters = { deletedAt: null, id: id };
    const order = { createdAt: "desc" };

    const visits = await prisma.visit.findMany({
      where: filters,
      orderBy: order,
      skip: skip,
      take: take,
    });

    if (visits.length > 0) {
      const responseVisits = visits.map((visit) => ({
        id: visit.id,
        visitorCIN: visit.visitorCIN,
        division: visit.division,
        visitReason: visit.visitReason,
        visitor: visit.visitor,
        createdAt: visit.createdAt.toISOString(),
        updatedAt: visit.updatedAt.toISOString(),
      }));
      res.status(SuccessHttpStatusCode.OK).send({
        data: responseVisits,
      });
    } else {
      res.status(ErrorHttpStatusCode.NOT_FOUND).send({
        statusCode: ErrorHttpStatusCode.NOT_FOUND,
        title: ErrorTitle.VISIT_NOT_FOUND,
        message: ErrorMessage.VISIT_NOT_FOUND,
      });
    }
  } catch (error) {
    res.status(ErrorHttpStatusCode.NOT_FOUND).send({
      statusCode: ErrorHttpStatusCode.NOT_FOUND,
      title: ErrorTitle.INVALID_VISIT_DATA,
      message: ErrorMessage.INVALID_VISIT_DATA,
    });
  }
};

// const addVisit = async (req, res) => {};
// const updateVisit = async (req, res) => {};
// const deleteVisit = async (req, res) => {};

export default {
  getVisits,
};
