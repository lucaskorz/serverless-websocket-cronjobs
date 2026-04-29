
import type { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { env } from "../config/env.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../clients/dynamoClient.js";

export class ConnectController {
  static async handle(event: APIGatewayProxyWebsocketEventV2) {
    const { connectionId, connectedAt } = event.requestContext;

    const putCommand = new PutCommand({
      TableName: env.connectionsTable,
      Item: {
        connectionId,
        connectedAt
      }
    })

    await dynamoClient.send(putCommand);
  }
}