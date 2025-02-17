import { Controller, Post, Body, HttpCode, HttpStatus, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

import { CreateAccountDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('User Account')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: 201, description: 'Account created successfully. Please verify your email.' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async signup(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.signup(createAccountDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }


}
