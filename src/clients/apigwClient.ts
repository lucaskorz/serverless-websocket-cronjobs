import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";
import { env } from "../config/env.js";

export const apigwClient = new ApiGatewayManagementApiClient({
  endpoint: env.webSocketsApi
})