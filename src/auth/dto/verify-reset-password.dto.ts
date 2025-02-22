import { IsEmail, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyResetOtpDto {
  @ApiProperty({ description: 'The OTP sent for password reset.' })
  @IsInt()
  otp: number;

  @ApiProperty({ description: 'User email for OTP verification.' })
  @IsEmail()
  email: string;
}
