import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
   @ApiProperty()
    @IsString()
  email: string;
}
