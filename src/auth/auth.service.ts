import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  //function untuk register user
  async register(data: any) {
    // cek dulu apakah user sudah ada 
    const userExists =await this.usersService.findByUsername(data.username);
    if (userExists) {
      throw new BadRequestException('Username sudah digunakan');
    }
    // cek apakah email sudah digunakan
    const emailExists =
      await this.usersService.findByEmail(data.email);

    if (emailExists) {
      throw new BadRequestException('Email sudah digunakan');
    }
    // hash password agar bukan raw password yang terkirim ke database
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.createUser({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });

    return {
      message: 'User berhasil diregister',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  // function handle login
  async login(data: any) {
    //mencari user berdasarkan username 
    const user =await this.usersService.findByUsername(data.username);
    //throw exception jika username tidak sesuai
    if (!user) {
      throw new UnauthorizedException('Username invalid!');
    }
    //jika username ada maka akan di compare passwordnya
    const isUser = await bcrypt.compare(
      data.password,
      user.password,
    );
    //throw exception jika password tidak sesuai
    if (!isUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.id,
      username: user.username,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  //function untuk mencari user berdasarkan ID
  async getUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}