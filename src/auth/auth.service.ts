import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ForgotPasswordDto } from './dto/forgot-password.dto';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from './entities/auth.entity';
import { UserPreference } from 'src/preferences/entities/preference.entity';
import { CreateAccountDto } from './dto/create-auth.dto';
import { VerifyResetOtpDto } from './dto/verify-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPreference)
    private preferenceRepository: Repository<UserPreference>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Utility: Generate a 4-digit OTP
  private generateOtp(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  // Create account and send OTP (simulate email sending)
  async signup(createAccountDto: CreateAccountDto): Promise<any> {
    const existingUser = await this.userRepository.findOne({ where: { email: createAccountDto.email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const user = this.userRepository.create(createAccountDto);
    user.emailOtp = this.generateOtp();
    user.emailVerified = false;
    const savedUser = await this.userRepository.save(user);

    // Create default preferences for the user
    const preferences = this.preferenceRepository.create({
      user: savedUser,
      areas_of_focus: {
        work: {
          "Time Management": false,
          "Productivity": false,
          "Stress Reduction": false,
          "Creativity": false,
        },
        mental_health: {
          "Mindfulness": false,
          "Meditation": false,
          "Emotional Well-Being": false,
          "Anxiety Reduction": false,
        },
        academics: {
          "Focus & Concentration": false,
          "Memory Improvement": false,
          "Stress Reduction": false,
          "Study Efficiency": false,
        },
        sports: {
          "Mental Resilience": false,
          "Motivation": false,
          "Focus & Precision": false,
          "Relaxation for Recovery": false,
        },
      },
      interests_and_goals: {
        mindfulness_relaxation: {
          "Meditation": false,
          "Better Sleep": false,
          "Stress Reduction": false,
        },
        performance_productivity: {
          "Time Management": false,
          "Productivity": false,
          "Focus & Attention": false,
          "Creativity Boost": false,
        },
        cognitive_enhancement: {
          "Memory Improvement": false,
          "Learning Efficiency": false,
          "Problem-Solving Skills": false,
        },
        emotional_growth: {
          "Anxiety Management": false,
          "Self-Confidence": false,
          "Emotional Regulation": false,
        },
      },
    });
    await this.preferenceRepository.save(preferences);

    // Simulate sending email with OTP
    console.log(`Verification OTP for ${savedUser.email}: ${savedUser.emailOtp}`);
    return { message: "Account created successfully. Please verify your email." };
  }

  // Verify email using OTP
  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<any> {
    const { email, otp } = verifyEmailDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (user.emailOtp !== otp) {
      return { verified: false, message: "Invalid OTP. Please try again." };
    }
    user.emailVerified = true;
    user.emailOtp = null;
    await this.userRepository.save(user);
    return { verified: true, message: "Email verified successfully." };
  }

  // Login and return JWT token along with user details and preferences
  async login(email: string, password: string): Promise<any> {
    // Explicitly select the password field
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'first_name', 'last_name', 'email', 'password', 'gender', 'dob'],
    });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    if (!user.emailVerified) {
      throw new UnauthorizedException("Email not verified");
    }
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    // Since preferences are eagerly loaded via the relation in User, they are available on user.preferences.
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      gender: user.gender,
      dob: user.dob,
      token,
      preferences: user.preferences || {},
    };
  }

   /**
   * Forgot Password
   * This method generates a password reset OTP and (in production) would send it via email.
   */
   async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    // Generate and assign a new OTP for password reset
    user.resetOtp = this.generateOtp();
    await this.userRepository.save(user);

    // In production, integrate an email service here.
    console.log(`Password reset OTP for ${user.email}: ${user.resetOtp}`);

    return { message: "A password reset OTP has been sent to your email." };
  }


   /**
   * Verify Reset OTP
   * This method validates the OTP submitted by the user.
   */
  async verifyResetOtp(verifyResetOtpDto: VerifyResetOtpDto): Promise<any> {
    const { email, otp } = verifyResetOtpDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    // Check if the OTP matches the one stored in the database
    if (user.resetOtp !== otp) {
      return { verified: false, message: "Invalid OTP. Please try again." };
    }
    // Optionally, you could store a flag that OTP has been verified (with expiry)
    return { verified: true, message: "OTP verified successfully. You may now reset your password." };
  }

   /**
   * Reset Password
   * This method resets the user password after OTP verification.
   */
   async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { email, password } = resetPasswordDto;
    // Ensure to select the password field since it is not selected by default.
    const user = await this.userRepository.findOne({ where: { email }, select: ['id', 'password'] });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    // You may include additional password strength validation here.

    // Hash the new password using bcrypt.
    user.password = await bcrypt.hash(password, 10);
    // Clear the reset OTP to invalidate it after successful password change.
    user.resetOtp = null;
    await this.userRepository.save(user);
    return { message: "Your password has been reset successfully." };
  }

  // Get authenticated user details (preferences are loaded via relation)
  async getUserDetails(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      gender: user.gender,
      dob: user.dob,
      preferences: user.preferences || {},
    };
  }
}
