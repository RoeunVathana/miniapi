import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private nextId = 3;

  private readonly users: User[] = [
    {
      id: 1,
      name: 'Alice Customer',
      email: 'alice@example.com',
      role: 'customer',
      isActive: true,
      createdAt: '2026-01-10T08:00:00.000Z',
      updatedAt: '2026-01-10T08:00:00.000Z',
    },
    {
      id: 2,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      isActive: true,
      createdAt: '2026-01-10T08:00:00.000Z',
      updatedAt: '2026-01-10T08:00:00.000Z',
    },
  ];

  findAll(role?: UserRole) {
    if (!role) {
      return this.users;
    }

    return this.users.filter((user) => user.role === role);
  }

  findOne(id: number) {
    const user = this.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    return user;
  }

  create(createUserDto: CreateUserDto) {
    const email = createUserDto.email.toLowerCase();
    this.ensureEmailIsAvailable(email);

    const now = new Date().toISOString();
    const user: User = {
      id: this.nextId++,
      name: createUserDto.name,
      email,
      role: 'customer',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(user);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);

    if (updateUserDto.email) {
      const email = updateUserDto.email.toLowerCase();
      this.ensureEmailIsAvailable(email, id);
      user.email = email;
    }

    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.role !== undefined) user.role = updateUserDto.role;
    if (updateUserDto.isActive !== undefined)
      user.isActive = updateUserDto.isActive;
    user.updatedAt = new Date().toISOString();

    return user;
  }

  remove(id: number) {
    const userIndex = this.users.findIndex((item) => item.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    const [deletedUser] = this.users.splice(userIndex, 1);
    return deletedUser;
  }

  private ensureEmailIsAvailable(email: string, currentUserId?: number) {
    const emailInUse = this.users.some(
      (user) => user.email === email && user.id !== currentUserId,
    );

    if (emailInUse) {
      throw new ConflictException(`Email ${email} is already in use`);
    }
  }
}
