import { Response } from "express";

class BaseApi {
  protected sendResponse(
    res: Response,
    statusCode: number,
    errorMessage: string
  ) {
    return res.status(statusCode).json({ error: errorMessage });
  }

  protected sendBadRequest(res: Response, errorMessage: string) {
    return this.sendResponse(res, 400, errorMessage);
  }

  protected sendInternalServerError(res: Response, errorMessage: string) {
    return this.sendResponse(res, 500, errorMessage);
  }
}

export default BaseApi;
