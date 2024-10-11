import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./login.dto";
import * as bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";


@Injectable()
export class UsersService 
{
  constructor(private prisma: PrismaClient, private jwtService: JwtService) {}

  async login(loginDto: LoginDto) 
  {
    const { email, password } = loginDto;
    
    // Buscar o usuário pelo e-mail
    const user = await this.prisma.appUser.findUnique
    ({
      where: { email },
    });

    // Verificar se o usuário existe e se a senha está correta
    if (!user || !bcrypt.compareSync(password, user.password)) 
    {
      throw new UnauthorizedException('E-mail e/ou senha incorretos');
    }

    // Gerar o token JWT
    const token = this.jwtService.sign({ id: user.id, email: user.email, type: user.type });

    // Retornar os dados conforme o esperado
    return {
      id: user.id,
      type: user.type,
      name: user.username,
      token,
    };
  }
}
