import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { User } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Import the User entity for use in this module
  controllers: [UserController], // Registers the controller
  providers: [UserService], // Registers the service
  exports: [UserService], // Exports the UserService to be used in other modules if needed
})
export class UserModule {}
