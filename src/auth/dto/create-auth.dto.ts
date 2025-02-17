import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ description: "User's first name" })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: "User's last name" })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ description: "User's email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User's password", minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
