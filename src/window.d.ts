import {Socket} from "socket.io-client";

declare global {
  interface Window {
    socketIo: Socket;
  }
}

window.socketId = null;
