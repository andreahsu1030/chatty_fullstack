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
  @WebSocketServer() server: Server;
  constructor(
    private readonly messagesService: MessagesService,
    private readonly chatsService: ChatsService,
  ) {}

  private users: Record<string, { socketId: string; username: string }> = {};
  private socketToUser: Record<string, string> = {};

  handleConnection(client: Socket) {
    console.log('New user connected..', client.id)
    const userId = this.socketToUser[client.id];
    console.log('userId', userId)
    client.broadcast.emit('user-joined', {message: `User joined the chat ${client.id}`})
    this.server.emit('user-joined', {message: `User joined the chat ${client.id}`})
  }

  handleDisconnect(client: Socket) {
    console.log('User is disconnected..', client.id)
    this.server.emit('user-left', {message: `User left the chat ${client.id}`})

    const userId = this.socketToUser[client.id];
    if (userId) {
      console.log(`${userId} disconnected`);
      delete this.users[userId];
      delete this.socketToUser[client.id];
    }
  }

  @SubscribeMessage('join')
  async handleJoinChat(
    @MessageBody() data: { userId: string; chatId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {

    // 記錄用戶的 socketId，確保用戶可以接收 WebSocket 訊息
    this.users[data.userId] = { socketId: client.id, username: data.username };
    this.socketToUser[client.id] = data.userId;

    console.log(' Client connected:', {
      socketId: client.id,
      userId: client.handshake.auth?.userId,
      username: client.handshake.auth?.username
    });

    // 查找 `chatId` 是否存在
    const chat = await this.chatsService.findChatByChatId(data.chatId);
    if (!chat) {
      return;
    }

    // 查找「未讀訊息」
    const unreadMessages =
      await this.messagesService.findMsgByChatIdAndReadStatus(
        data.chatId,
        false,
      );

    if (unreadMessages.length > 0) {
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

    const chat = await this.chatsService.findChatByChatId(data.chatId);
    if (!chat) {
      return;
    }

    const { chatId, sender, content } = data;
    await this.messagesService.createMsg({
      chatId,
      sender,
      content,
    });

    const recipient = this.users[data.recipient]; 
    if (recipient) {
      this.server.to(recipient.socketId).emit('receiveMessage', {
        sender: this.users[data.sender]?.username || 'Unknown',
        message: data.content,
      })
    }else{
     console.log('找不到使用者')   
    }
  }
}
