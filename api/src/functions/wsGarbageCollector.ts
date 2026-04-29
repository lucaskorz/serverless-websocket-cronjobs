import { GetConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { paginateScan } from "@aws-sdk/client-dynamodb";
import { dynamoClient, dynamoDBClient } from "../clients/dynamoClient.js";
import { env } from "../config/env.js";
import { apigwClient } from "../clients/apigwClient.js";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

export async function handler() {
  const paginator = paginateScan(
    { client: dynamoDBClient },
    { TableName: env.connectionsTable }
  );

  for await (const { Items = [] } of paginator) {
    await Promise.allSettled(Items.map(async item => {
      try {
        const getConnectionCommand = new GetConnectionCommand({
          ConnectionId: item.connectionId?.S,
        })

        await apigwClient.send(getConnectionCommand);
      } catch {
        const deleteCommand = new DeleteCommand({
          TableName: env.connectionsTable,
          Key: {
            connectionId: item.connectionId?.S,
          }
        })

        await dynamoClient.send(deleteCommand);
      }
    }))
  }
}