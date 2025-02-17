/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { CustomConfigModule } from './config/config.module';
import { User } from './auth/entities/auth.entity';
import AppDataSource from 'ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([User]),  // Add this line to import the User entity
    UserModule,
    AuthModule,
    CustomConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
