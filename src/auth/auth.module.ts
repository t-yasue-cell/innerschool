import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { GoogleStrategy } from './strategies/google.strategy';
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService /* LocalStrategy, JwtStrategy/*GoogleStrategy, */],
})
export class AuthModule {}
