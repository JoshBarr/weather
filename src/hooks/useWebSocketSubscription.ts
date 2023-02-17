import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { reconnectingSocket } from "./socket";

export const useWebSocketSubscription = () => {
  const queryClient = useQueryClient();
  const socketRef = useRef<ReturnType<typeof reconnectingSocket> | undefined>();
  const [isSocketOpen, setSocketOpen] = useState(
    socketRef.current?.isConnected()
  );

  useEffect(() => {
    const socketClient = reconnectingSocket("wss://ws.postman-echo.com/raw");
    socketRef.current = socketClient;

    function handleMessage(event: MessageEvent<any>) {
      const data = JSON.parse(event.data);
      const queryKey = [...data.entity, data.id].filter(Boolean);
      queryClient.invalidateQueries({ queryKey });
    }

    socketClient.onStateChange(setSocketOpen);
    socketClient.on(handleMessage);

    return () => {
      socketClient.off(handleMessage);
    };
  }, [setSocketOpen, queryClient]);

  const sendMessage = (data: { entity: string[]; id: string }) => {
    socketRef.current?.send(data);
  };

  return {
    sendMessage,
    isSocketOpen,
  };
};
