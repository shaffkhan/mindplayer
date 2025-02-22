import { Controller, Post, Body, HttpCode, HttpStatus, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CreateAccountDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { VerifyResetOtpDto } from './dto/verify-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('User Account')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Create Account (Signup)
  @Post('signup')
  @ApiResponse({ status: 201, description: 'Account created successfully. Please verify your email.' })
  async signup(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.signup(createAccountDto);
  }

  // Verify Email (OTP Verification)
  @Post('verify-email')
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  // Login Account
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Login successful.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  // Forgot Password
  @Post('forgot-password')
  @ApiResponse({ status: 200, description: 'A password reset OTP has been sent to your email.' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  // Verify OTP for Password Reset
  @Post('verify-reset-otp')
  @ApiResponse({ status: 200, description: 'OTP verified successfully. You may now reset your password.' })
  async verifyResetOtp(@Body() verifyResetOtpDto: VerifyResetOtpDto) {
    return this.authService.verifyResetOtp(verifyResetOtpDto);
  }

  // Reset Password
  @Post('reset-password')
  @ApiResponse({ status: 200, description: 'Your password has been reset successfully.' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // Get User Details (Protected)
  @UseGuards(JwtAuthGuard)
  @Get('user')
  @ApiResponse({ status: 200, description: 'User details retrieved successfully.' })
  async getUserDetails(@Request() req) {
    return this.authService.getUserDetails(req.user.id);
  }
}
