import { ConflictException, Injectable, UnauthorizedException, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./login.dto";
import * as bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
import { CreateUserDto } from "./createUser.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaClient, private jwtService: JwtService) {}

  // Método de login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar o usuário pelo e-mail
    const user = await this.prisma.appUser.findUnique({
      where: { email },
    });

    // Verificar se o usuário existe e se a senha está correta
    if (!user || !bcrypt.compareSync(password, user.password)) {
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

  // Método de criação de usuário
  async createUser(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;

    // Verificar se o usuário já existe
    const userExists = await this.prisma.appUser.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('Usuário informado já existe!');
    }

    // Criptografar a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await this.prisma.appUser.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      return {
        message: 'Usuário criado com sucesso!',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao criar usuário: ${error.message}`);
    }
  }
}
