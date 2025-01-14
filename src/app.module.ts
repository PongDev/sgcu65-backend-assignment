import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { TeamModule } from './team/team.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    UserModule,
    TaskModule,
    TeamModule,
    AuthModule,
  ],
})
export class AppModule {}
