import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: id },
      select: { id: true, email: true, name: true, Task: true },
    });
    if (user) return user;

    throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );

      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Falha ao cadastrar usuário',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: id },
      });

      if (!user) {
        throw new HttpException('Usuário não existe', HttpStatus.BAD_REQUEST);
      }

      const dataUser: { name?: string; passwordHash?: string } = {
        name: updateUserDto.name ? updateUserDto.name : user.name,
      };

      if (updateUserDto?.password) {
        const passwordHash = await this.hashingService.hash(
          updateUserDto.password,
        );
        dataUser['passwordHash'] = passwordHash;
      }

      const updateUser = await this.prisma.user.update({
        where: { id: id },
        data: {
          name: dataUser.name,
          passwordHash: dataUser?.passwordHash
            ? dataUser.passwordHash
            : user.passwordHash,
        },
        select: { id: true, name: true, email: true },
      });

      return updateUser;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Falha ao atualizar usuário',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: id },
      });

      if (!user) {
        throw new HttpException('Usuário não existe', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.user.delete({ where: { id: id } });

      return {
        message: 'Usuário deletado com sucesso!',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Falha ao deletar usuário',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
