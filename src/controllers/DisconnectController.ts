import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { env } from "../config/env.js";
import { dynamoClient } from "../clients/dynamoClient.js";

export class DisconnectController {
  static async handle(event: APIGatewayProxyWebsocketEventV2) {
    const { connectionId } = event.requestContext;

    const deleteCommand = new DeleteCommand({
      TableName: env.connectionsTable,
      Key: {
        connectionId
      }
    });

    await dynamoClient.send(deleteCommand);
  }
}