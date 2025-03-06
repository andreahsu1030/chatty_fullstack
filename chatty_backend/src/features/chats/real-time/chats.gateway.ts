import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/features/messages/messages.service';
import { ChatsService } from '../chats.service';

@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly messagesService: MessagesService,
    private readonly chatsService: ChatsService,
  ) {}

  private users: Record<string, { socketId: string; username: string }> = {};

  private socketToUser: Record<string, string> = {};

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
    console.log('handleDisconnect', client);
    const userId = this.socketToUser[client.id];
    if (userId) {
      delete this.users[userId];
      delete this.socketToUser[client.id];
      console.log(`❌ User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('join')
  async handleJoinChat(
    @MessageBody() data: { userId: string; chatId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(
      `✅ User ${data.username} (ID: ${data.userId}) joined chat ${data.chatId} with socket ID: ${client.id}`,
    );

    // 記錄用戶的 socketId，確保用戶可以接收 WebSocket 訊息
    this.users[data.userId] = { socketId: client.id, username: data.username };
    this.socketToUser[client.id] = data.userId;

    // 查找 `chatId` 是否存在
    const chat = await this.chatsService.findChatByChatId(data.chatId);
    if (!chat) {
      console.log(`❌ Chat room ${data.chatId} not found.`);
      return;
    }

    // 查找「未讀訊息」
    const unreadMessages =
      await this.messagesService.findMsgByChatIdAndReadStatus(
        data.chatId,
        false,
      );

    if (unreadMessages.length > 0) {
      console.log(
        `🔔 發送未讀訊息 (${unreadMessages.length} 條) 給用戶 ${data.userId}`,
      );
      client.emit('unreadMessages', unreadMessages);
    }
  }

  @SubscribeMessage('sendMessage')
  async handlePrivateMessage(
    @MessageBody()
    data: {
      chatId: string;
      sender: string;
      recipient: string;
      content: string;
    },
  ) {


    // 查找聊天室是否存在
    const chat = await this.chatsService.findChatByChatId(data.chatId);
    if (!chat) {
      console.log(`❌ Chat room ${data.chatId} not found.`);
      return;
    }

    const { chatId, sender, content } = data;
    const newMsg = await this.messagesService.createMsg({
      chatId,
      sender,
      content,
    });

    const recipient = this.users[data.recipient];

    if (recipient) {
      this.server.to(recipient.socketId).emit('receiveMessage', {
        sender: this.users[data.sender]?.username || 'Unknown',
        message: data.content,
      });
    }
  }
}
