import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './login.dto';
import { CreateUserDto } from './createUser.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
export class UsersController 
{
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) 
  {
    return this.usersService.login(loginDto);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findUserById(@Param('id') id: string) 
  {
    // Convertendo o ID para número antes de chamar o service
    const userId = parseInt(id, 10);
    return this.usersService.findUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser
  (
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ) 
  {
    const userId = parseInt(id, 10);
    return this.usersService.updateUser(userId, updateUserDto);
  }
}
