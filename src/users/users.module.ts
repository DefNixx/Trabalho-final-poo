import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from 'src/auth/auth.module';

@Module
({
  imports: 
  [
    JwtModule.register
    ({
      secret: 'segredo', 
      signOptions: { expiresIn: '1h' }, // Tempo de expiração do token
    }),

    
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaClient],
})
export class UsersModule {}
