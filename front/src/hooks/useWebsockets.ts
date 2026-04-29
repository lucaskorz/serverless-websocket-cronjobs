
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { messageTratted } from "../../utils/messageTratted";

interface IUSeWebsocketsOptions {
  url: string;
  onMessage(message: string): void;
}

export function useWebsockets({ url, onMessage }: IUSeWebsocketsOptions) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const websocket = useRef<WebSocket | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  const memoizedOnMessage = useRef(onMessage);

  useLayoutEffect(() => {
    memoizedOnMessage.current = onMessage;
  }, [onMessage])

  useEffect(() => {
    const ws = new WebSocket(url);
    websocket.current = ws;

    function handleNewMessage(event: MessageEvent<string>) {
      const message = messageTratted(event.data);
      memoizedOnMessage.current(message)
    }

    function handleOpen() {
      setIsLoading(false);
    }

    function handleError() {
      setHasError(true);
    }

    ws.addEventListener("message", handleNewMessage);
    ws.addEventListener("open", handleOpen);
    ws.addEventListener("error", handleError);

    return () => {
      ws.close();
      ws.removeEventListener("message", handleNewMessage);
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("error", handleError);
      websocket.current = null;
    };
  }, [url]);

  const sendMessage = useCallback((data: Record<string, any>) => {
    websocket.current?.send(JSON.stringify(data));
  }, [])

  return { isLoading, hasError, sendMessage };
}