import { ConflictException, Injectable, UnauthorizedException, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./login.dto";
import * as bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
import { CreateUserDto } from "./createUser.dto";
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from "./update-user.dto";

@Injectable()
export class UsersService 
{
  constructor(private prisma: PrismaClient, private jwtService: JwtService) {}

  // Método de login
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

  // Método de criação de usuário
  async createUser(createUserDto: CreateUserDto) 
  {
    const { email, username, password } = createUserDto;

    // Verificar se o usuário já existe
    const userExists = await this.prisma.appUser.findUnique
    ({
      where: { email },
    });

    if (userExists) 
    {
      throw new ConflictException('Usuário informado já existe!');
    }

    // Criptografar a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await this.prisma.appUser.create
      ({
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
    } catch (error) 
    {
      throw new InternalServerErrorException(`Erro ao criar usuário: ${error.message}`);
    }
  }

  async findUserById(id: number) 
  {
    // Tenta buscar o usuário pelo ID
    const user = await this.prisma.appUser.findUnique
    ({
      where: { id },
    });

    // Se o usuário não for encontrado, lança uma exceção 404
    if (!user) 
    {
      throw new NotFoundException('Usuário não encontrado!');
    }

    // Retorna o usuário encontrado
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) 
  {
    // Primeiro, tentamos encontrar o usuário pelo ID
    const user = await this.prisma.appUser.findUnique
    ({
      where: { id },
    });

    if (!user) 
    {
      // Se o usuário não for encontrado, lançamos uma exceção 404
      throw new NotFoundException('Usuário não encontrado!');
    }

    try 
    {
      // Atualizamos os dados do usuário com os campos fornecidos
      const updatedUser = await this.prisma.appUser.update
      ({
        where: { id },
        data: {
          email: updateUserDto.email,
          username: updateUserDto.username,
          isActive: updateUserDto.isActive,
        },
      });

      return {
        message: 'Usuário atualizado com sucesso!',
        user: updatedUser,
      };
    } catch (error) 
    {
      // Se houver algum erro durante a atualização, retornamos uma exceção com o código de erro
      throw new InternalServerErrorException(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  // Método para excluir um usuário exemplo: http://localhost:3000/users/3 sendo 3 o id
  async deleteUser(id: number): Promise<void> {
    const user = await this.prisma.appUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prisma.appUser.delete({
      where: { id },
    });
  }
}
