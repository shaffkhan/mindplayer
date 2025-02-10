import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string; // Optional field for phone number

  @IsOptional()
  @IsEnum(['user', 'admin'])
  role?: 'user' | 'admin'; // Optional role field, defaults to 'user'
}
