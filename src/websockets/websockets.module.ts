import { Module } from '@nestjs/common';
import { Socket } from 'socket.io-client';

@Module({
  providers: [
    {
      provide: 'SOCKET_IO',
      useValue: Socket,
    },
  ],
  exports: ['SOCKET_IO'],
})
export class WebsocketsModule {}
