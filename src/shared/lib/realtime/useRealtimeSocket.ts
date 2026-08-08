import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

const getRealtimeServerUrl = (): string => {
  const configuredUrl = import.meta.env.VITE_API_URL as unknown;

  return typeof configuredUrl === "string" && configuredUrl !== ""
    ? configuredUrl
    : "http://localhost:3005";
};

export const useRealtimeSocket = (
  namespace: `/${string}`,
  accessToken: string | null,
  enabled = true,
): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!enabled || !accessToken) {
      setSocket(null);
      return undefined;
    }

    const nextSocket = io(`${getRealtimeServerUrl()}${namespace}`, {
      auth: {
        token: `Bearer ${accessToken}`,
      },
      transports: ["websocket"],
    });

    setSocket(nextSocket);

    return () => {
      nextSocket.disconnect();
      setSocket((currentSocket) => (currentSocket === nextSocket ? null : currentSocket));
    };
  }, [accessToken, enabled, namespace]);

  return socket;
};
