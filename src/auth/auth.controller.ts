import {
  Controller,
  Get,
  Post,
  Request,
  Render,
  Body,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @Render('authPage')
  auth() {}

  @Post('/login')
  login(@Body('password') password: string, @Response() res) {
    if (password === 'kamajo1904') {
      res.cookie('kj_auth', 'ok', { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
    } else {
      res.cookie('kj_auth', 'ng', { httpOnly: true, maxAge: 1000 * 60 * 30 });
    }
    return res.redirect('/');
  }
}
