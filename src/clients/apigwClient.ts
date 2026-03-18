import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";

export const apigwClient = new ApiGatewayManagementApiClient({
  endpoint: 'https://ufr1odqv53.execute-api.us-east-1.amazonaws.com/dev'
})