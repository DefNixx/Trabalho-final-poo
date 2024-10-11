import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module
({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register
    ({
      secret: 'segredo',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
