import io from 'socket.io-client';
import { useCallback } from 'react';

const sockets: { [key: string]: SocketIOClient.Socket } = {};
const backUrl = 'http://localhost:3095';
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  // 1. 프론트와 백엔드의 같은 소켓 io 로 연결

  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      // 연결해제
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    // 2. 프론트에서 백으로 ws-sleact 소켓에 연결
    // 3. 서버에서 hello를 보내줌
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }

  // 보내기
  return [sockets[workspace], disconnect];
};

export default useSocket;
