import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { User } from './entities/auth.entity';
import { CreateAccountDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(createAccountDto: CreateAccountDto) {
    const existingUser = await this.usersRepository.findOne({ where: { email: createAccountDto.email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const user = this.usersRepository.create(createAccountDto);
    await this.usersRepository.save(user);

    // In production, send a verification email here.
    return { message: 'Account created successfully. Please verify your email.' };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      gender: user.gender,
      dob: user.dob,
      token,
    };
  }
 
}
