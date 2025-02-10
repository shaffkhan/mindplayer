import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from './entities/auth.entity';
import { UserService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,


  ) {}

  async signup(createUserDto: CreateAuthDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    const token = this.generateToken(user);
    return { success: true, message: 'User created successfully', data: { token } };
  }

  async signin(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { success: true, message: 'Login successful', data: { token } };
  }

  async validateUserById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }


  async forgotPassword(email: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate password reset token (this example uses JWT)
    const resetToken = this.jwtService.sign(
      { email: user.email },
      { secret: this.configService.get('JWT_SECRET'), expiresIn: '1h' }, // Token expires in 1 hour
    );

    // In a real-world scenario, you would also save this token in the database or send the link via email
    // For this example, we're just returning the token (In production, you would send an email)
    
    return {
      message: 'Password reset link sent to your email.',
      resetToken, // Send token (you would typically email this link)
    };
  }
}