import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private users = [
    {
      id: 1,
      email: 'test@example.com',
      password: bcrypt.hashSync('password', 10),
    },
  ];

  constructor() {}
}
