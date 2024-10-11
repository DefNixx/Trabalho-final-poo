//Back-end criado por Givanildo Barbosa, Jefferson Eduardo, João Eduardo e Nícolas André

import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users/users.module';

async function bootstrap() 
{
  const app = await NestFactory.create(UsersModule);
  await app.listen(3000);
}
bootstrap();
