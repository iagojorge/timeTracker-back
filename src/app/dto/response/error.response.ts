import { ResponseType } from "../../../shared/enums/response.type";

export interface ErrorResponse {
  type: ResponseType;
  message: string;
}
