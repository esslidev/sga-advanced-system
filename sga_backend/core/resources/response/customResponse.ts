import { FastifyReply } from "fastify";
import { HttpStatusCode } from "../../enums/response/httpStatusCode";

class CustomResponse {
  constructor(private reply: FastifyReply) {}

  send(
    data?: any,
    {
      statusCode = HttpStatusCode.OK,
      statusMessage = "Success",
    }: { statusCode?: HttpStatusCode; statusMessage?: string } = {}
  ) {
    return this.reply.status(statusCode).send({
      ...data,
      status: statusMessage,
    });
  }
}

export default CustomResponse;
