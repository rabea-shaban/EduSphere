import * as React from "react";
import { useSocketContext } from "@/providers/socket-provider";

export function useSocketState() {
  const { socket, isConnected, connectionState, onlineUserIds } = useSocketContext();
  return {
    socket,
    isConnected,
    connectionState,
    onlineUserIds,
    onlineCount: onlineUserIds.length,
  };
}

export function useRealtimeRoom(roomName?: string) {
  const { socket, isConnected } = useSocketContext();

  React.useEffect(() => {
    if (!socket || !isConnected || !roomName) return;

    socket.emit("join-room", roomName);

    return () => {
      socket.emit("leave-room", roomName);
    };
  }, [socket, isConnected, roomName]);
}

export function useLiveEventListener<T = any>(eventName: string, callback: (payload: T) => void) {
  const { socket, isConnected } = useSocketContext();

  React.useEffect(() => {
    if (!socket || !isConnected || !eventName) return;

    socket.on(eventName, callback);

    return () => {
      socket.off(eventName, callback);
    };
  }, [socket, isConnected, eventName, callback]);
}
