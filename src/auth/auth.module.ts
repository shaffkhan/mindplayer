import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt-strategy';
import { User } from './entities/auth.entity';
import { UserModule } from 'src/users/users.module';
import { CustomConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    CustomConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET')||"metalens";
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '1d' },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    UserModule, 
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
