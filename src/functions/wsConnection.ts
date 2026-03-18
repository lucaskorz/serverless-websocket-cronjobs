import type { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { apigwClient } from '../clients/apigwClient.js';

let connections: string[] = [];

type RouteKey = '$connect' | '$disconnect' | 'sendMessage';

function sendMessage(message: string) {
  return Promise.all(connections.map(async connId => {
    const postToConnectionCommand = new PostToConnectionCommand({
      ConnectionId: connId, Data: JSON.stringify({ message })
    });

    await apigwClient.send(postToConnectionCommand);
  }))
}

export async function handler(event: APIGatewayProxyWebsocketEventV2) {
  const routeKey = event.requestContext.routeKey as RouteKey;
  const { connectionId } = event.requestContext;

  if (routeKey === '$connect') {
    await sendMessage(`${connectionId} entrou no chat!`);
    connections.push(connectionId);
  }

  if (routeKey === '$disconnect') {
    connections = connections.filter(conn => conn !== connectionId);
  }

  if (routeKey === 'sendMessage') {
    await sendMessage('Nova mensagem acabou de chegar!');
  }

  connections.push(connectionId);

  return { statusCode: 200 }
}