import { Response } from "express";
import { ErrorResponse } from "../dto/response/error.response";

class BaseApi {
  protected sendErrorResponse(
    res: Response,
    statusCode: number,
    errorResponse: ErrorResponse
  ) {
    return res.status(statusCode).json(errorResponse);
  }

  protected sendBadRequest(res: Response, errorResponse: ErrorResponse) {
    return this.sendErrorResponse(res, 400, errorResponse);
  }

  protected sendNotFound(res: Response, errorResponse: ErrorResponse) {
    return this.sendErrorResponse(res, 404, errorResponse);
  }

  protected sendInternalServerError(
    res: Response,
    errorResponse: ErrorResponse
  ) {
    return this.sendErrorResponse(res, 500, errorResponse);
  }
}

export default BaseApi;
