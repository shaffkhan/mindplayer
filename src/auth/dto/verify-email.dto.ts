import { IsEmail, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ description: 'OTP sent to the user’s email.' })
  @IsInt()
  otp: number;

  @ApiProperty({ description: 'User email address to verify.' })
  @IsEmail()
  email: string;
}
