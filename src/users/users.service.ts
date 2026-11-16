import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(role?: UserRole) {
    const users = await this.prisma.user.findMany({
      where: role ? { role } : undefined,
      orderBy: { id: 'asc' },
    });

    return users.map((user) => this.toResponse(user));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    return this.toResponse(user);
  }

  async create(createUserDto: CreateUserDto) {
    const email = createUserDto.email.toLowerCase();
    await this.ensureEmailIsAvailable(email);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email,
        role: 'customer',
        isActive: true,
      },
    });

    return this.toResponse(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    let email: string | undefined;
    if (updateUserDto.email) {
      email = updateUserDto.email.toLowerCase();
      await this.ensureEmailIsAvailable(email, id);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email,
        role: updateUserDto.role,
        isActive: updateUserDto.isActive,
      },
    });

    return this.toResponse(user);
  }

  async remove(id: number) {
    await this.findOne(id);
    const user = await this.prisma.user.delete({ where: { id } });
    return this.toResponse(user);
  }

  private async ensureEmailIsAvailable(email: string, currentUserId?: number) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== currentUserId) {
      throw new ConflictException(`Email ${email} is already in use`);
    }
  }

  private toResponse(user: Prisma.UserGetPayload<{}>): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
