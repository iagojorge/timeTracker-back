import { Response } from "express";

class BaseApi {
  protected sendResponse(res: Response, statusCode: number, apiResponse: any) {
    return res.status(statusCode).json(apiResponse);
  }

  protected sendCreated(res: Response, apiResponse: any) {
    return this.sendResponse(res, 200, apiResponse);
  }

  protected sendBadRequest(res: Response, apiResponse: any) {
    return this.sendResponse(res, 400, apiResponse);
  }

  protected sendNotFound(res: Response, apiResponse: any) {
    return this.sendResponse(res, 404, apiResponse);
  }

  protected sendUnprocessableContent(res: Response, apiResponse: any) {
    return this.sendResponse(res, 422, apiResponse);
  }

  protected sendInternalServerError(res: Response, apiResponse: any) {
    return this.sendResponse(res, 500, apiResponse);
  }
}

export default BaseApi;
