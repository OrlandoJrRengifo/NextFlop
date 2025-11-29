import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new Error('Email already registered');
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({ email: dto.email, password: hashed, name: dto.name });
    return { id: user._id, email: user.email, name: user.name };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const matches = await bcrypt.compare(pass, user.password);
    if (!matches) return null;
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) return null;
    const payload = { sub: user._id.toString(), email: user.email };
    return this.jwtService.sign(payload);
  }
}
