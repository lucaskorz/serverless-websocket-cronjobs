import { paginateScan } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { dynamoDBClient } from '../clients/dynamoClient.js';
import { env } from '../config/env.js';
import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { apigwClient } from '../clients/apigwClient.js';

export async function handler(event: APIGatewayProxyWebsocketEventV2) {
  const { message } = JSON.parse(event.body ?? '{}');
  const paginator = paginateScan(
    { client: dynamoDBClient },
    { TableName: env.connectionsTable }
  );

  for await (const { Items = [] } of paginator) {
    await Promise.allSettled(Items.map(async item => {
      const postToConnectionCommand = new PostToConnectionCommand({
        ConnectionId: item.connectionId?.S,
        Data: JSON.stringify(message)
      })

      await apigwClient.send(postToConnectionCommand);
    }))
  }

  return { statusCode: 204 }
}