import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './features/auth/auth.module';
import secretConfig from './configs/secret.config';
import databaseConfig from './configs/database.config';
import { APP_PIPE } from '@nestjs/core';
import { ProfileModule } from './features/profiles/profile.module';
import { FriendshipModule } from './features/friendships/friendship.module';
import { ChatsModule } from './features/chats/chats.module';
import { MessagesModule } from './features/messages/messages.module';
import { NotificationsService } from './features/notifications/notifications.service';
import { NotificationsController } from './features/notifications/notifications.controller';
import { NotificationsModule } from './features/notifications/notifications.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, secretConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
    UsersModule,
    AuthModule,
    ProfileModule,
    FriendshipModule,
    ChatsModule,
    MessagesModule,
    NotificationsModule,
  ],
  controllers: [AppController, NotificationsController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          transform: true,
        });
      },
    },
    NotificationsService
  ],
})
export class AppModule {}
