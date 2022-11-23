import { SortBy } from "../../../src/enums/DynamoDBSortEnum";
import { httpRequestData } from "../../helpers/interfaces/httpRequest";
import { requestContextSuccessMock } from "../generic/request";

export const getRequestsSuccessMock: httpRequestData = {
  requestContext: requestContextSuccessMock,
};

export const getRequestsSortAscendSuccessMock: httpRequestData = {
  queryStringParameters: {
    sort: SortBy.asc,
  },
  requestContext: requestContextSuccessMock,
};
